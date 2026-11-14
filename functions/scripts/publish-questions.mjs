#!/usr/bin/env node
/**
 * Publicador de perguntas do Game Bíblico: content/game/*.json → Firestore `gamePerguntas`.
 *
 * Regra de ouro: por padrão só publica perguntas `status: "aprovado"` + `ativo != false`.
 * Cada doc recebe `sorteio = Math.random()` (usado pelo sorteio eficiente em iniciarSessao)
 * e `publicadoEm` (serverTimestamp). O gabarito (`respostaCorretaId`) e a `explicacao`
 * são MANTIDOS — a coleção `gamePerguntas` é lida só pelo Admin SDK/Functions, nunca pelo cliente
 * (protegido pelas firestore.rules).
 *
 * Uso (a partir da raiz do repo):
 *   # Emulador (seguro, sem credenciais):
 *   firebase emulators:start --only firestore   # noutro terminal
 *   npm run game:publish -- --emulator --dry-run
 *   npm run game:publish -- --emulator
 *
 *   # Produção (exige credenciais e confirmação explícita):
 *   GOOGLE_APPLICATION_CREDENTIALS=./sa.json npm run game:publish -- --project ipm-task-app --yes
 *
 * Flags:
 *   --emulator            Aponta para o Firestore emulado (localhost:8080) — ignora credenciais.
 *   --dry-run             Não escreve; só relata o que seria publicado.
 *   --status a,b          Status a publicar (default: "aprovado"). Ex.: --status aprovado,em_revisao (staging/playtest).
 *   --project <id>        Project id (default: ipm-task-app ou GCLOUD_PROJECT).
 *   --yes                 Confirma escrita em produção (obrigatório fora do emulador).
 *   [arquivos...]         Caminhos de entrada (default: content/game/questions.seed.json e questions.generated.json se existir).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

// firebase-admin vive em functions/node_modules; resolvemos a partir deste arquivo.
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

const DEFAULT_PROJECT = 'ipm-task-app';
const EMULATOR_HOST = 'localhost:8080';
const COLECAO = 'gamePerguntas';
const TRILHAS_VALIDAS = new Set(['UCP', 'UPA', 'UMP', 'Adultos']);

/** Faz o parse de argv em flags + arquivos posicionais. */
function parseArgs(argv) {
  const flags = { status: ['aprovado'], project: process.env.GCLOUD_PROJECT || DEFAULT_PROJECT };
  const arquivos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') flags.dryRun = true;
    else if (a === '--emulator') flags.emulator = true;
    else if (a === '--yes') flags.yes = true;
    else if (a === '--status') flags.status = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a.startsWith('--status=')) flags.status = a.slice(9).split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--project') flags.project = argv[++i];
    else if (a.startsWith('--project=')) flags.project = a.slice(10);
    else if (a.startsWith('--')) fatal(`Flag desconhecida: ${a}`);
    else arquivos.push(a);
  }
  return { flags, arquivos };
}

function fatal(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

/** Lê um arquivo JSON aceitando tanto um array quanto `{ perguntas: [...] }`. */
function lerPerguntas(caminho) {
  const bruto = JSON.parse(readFileSync(caminho, 'utf8'));
  const lista = Array.isArray(bruto) ? bruto : bruto.perguntas;
  if (!Array.isArray(lista)) fatal(`${caminho}: esperado um array ou um objeto com "perguntas".`);
  return lista;
}

/** Valida os campos essenciais de uma pergunta. Retorna lista de erros (vazia = ok). */
function validar(p) {
  const erros = [];
  if (!p.id || typeof p.id !== 'string') erros.push('id ausente/ inválido');
  if (!Array.isArray(p.trilhas) || p.trilhas.length === 0) erros.push('trilhas vazias');
  else if (p.trilhas.some((t) => !TRILHAS_VALIDAS.has(t))) erros.push(`trilha inválida em [${p.trilhas}]`);
  if (!Array.isArray(p.alternativas) || p.alternativas.length !== 4) erros.push('precisa de 4 alternativas');
  else if (!p.alternativas.every((alt) => alt && alt.id && typeof alt.texto === 'string')) {
    erros.push('alternativa sem id/texto');
  } else if (!p.alternativas.some((alt) => alt.id === p.respostaCorretaId)) {
    erros.push('respostaCorretaId não bate com nenhuma alternativa');
  }
  if (!p.enunciado) erros.push('enunciado ausente');
  return erros;
}

async function main() {
  const { flags, arquivos } = parseArgs(process.argv.slice(2));

  // Resolve entradas padrão (relativas ao cwd, i.e. raiz do repo quando via npm).
  let entradas = arquivos.map((a) => resolve(process.cwd(), a));
  if (entradas.length === 0) {
    const padrao = [
      resolve(process.cwd(), 'content/game/questions.seed.json'),
      resolve(process.cwd(), 'content/game/questions.generated.json'),
    ].filter(existsSync);
    if (padrao.length === 0) fatal('Nenhum arquivo de entrada e nenhum default encontrado em content/game/.');
    entradas = padrao;
  }
  for (const e of entradas) if (!existsSync(e)) fatal(`Arquivo não encontrado: ${e}`);

  const statusAlvo = new Set(flags.status);
  const alvoEmulador = flags.emulator || !!process.env.FIRESTORE_EMULATOR_HOST;

  // Guarda-corpo: escrita em produção exige --yes.
  if (!alvoEmulador && !flags.dryRun && !flags.yes) {
    fatal(
      `Publicação em PRODUÇÃO (project ${flags.project}) exige --yes.\n` +
      `  Use --emulator para testar localmente, ou --dry-run para simular.`
    );
  }

  // Coleta + dedupe por id (último vence) + índice de status.
  const porId = new Map();
  const statusCount = {};
  let totalLidas = 0;
  for (const caminho of entradas) {
    const lista = lerPerguntas(caminho);
    totalLidas += lista.length;
    for (const p of lista) {
      statusCount[p.status ?? 'sem-status'] = (statusCount[p.status ?? 'sem-status'] ?? 0) + 1;
      porId.set(p.id, p);
    }
  }

  // Filtra por status alvo + ativo + validação.
  const publicar = [];
  const invalidas = [];
  for (const p of porId.values()) {
    if (!statusAlvo.has(p.status)) continue;
    if (p.ativo === false) continue;
    const erros = validar(p);
    if (erros.length) invalidas.push({ id: p.id, erros });
    else publicar.push(p);
  }

  // Relatório.
  console.log('\n📖 Publicador de perguntas — Game Bíblico');
  console.log(`   Entradas   : ${entradas.map((e) => e.replace(process.cwd() + '/', '')).join(', ')}`);
  console.log(`   Lidas      : ${totalLidas} (únicas: ${porId.size})`);
  console.log(`   Por status : ${Object.entries(statusCount).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log(`   Status alvo: ${[...statusAlvo].join(', ')}`);
  console.log(`   Destino    : ${alvoEmulador ? `EMULADOR (${process.env.FIRESTORE_EMULATOR_HOST || EMULATOR_HOST})` : `PRODUÇÃO (${flags.project})`}`);
  console.log(`   A publicar : ${publicar.length}`);
  if (invalidas.length) {
    console.log(`\n⚠  ${invalidas.length} pergunta(s) do status-alvo reprovadas na validação (NÃO serão publicadas):`);
    for (const { id, erros } of invalidas) console.log(`   - ${id}: ${erros.join('; ')}`);
  }
  if ([...statusAlvo].join() !== 'aprovado') {
    console.log(`\n⚠  ATENÇÃO: publicando status fora de "aprovado" — use apenas para staging/playtest.`);
  }

  if (publicar.length === 0) {
    console.log('\nNada a publicar. Encerrando.\n');
    return;
  }
  if (flags.dryRun) {
    console.log('\n🔎 --dry-run: nenhuma escrita realizada. IDs que seriam publicados:');
    console.log('   ' + publicar.map((p) => p.id).join(', ') + '\n');
    return;
  }

  // Inicializa o Admin SDK.
  if (flags.emulator && !process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST;
  }
  admin.initializeApp({ projectId: flags.project });
  const db = admin.firestore();
  const { FieldValue } = admin.firestore;

  // Grava em lotes (limite de 500 por batch).
  let escritas = 0;
  const LOTE = 400;
  for (let i = 0; i < publicar.length; i += LOTE) {
    const batch = db.batch();
    for (const p of publicar.slice(i, i + LOTE)) {
      batch.set(db.collection(COLECAO).doc(p.id), {
        ...p,
        sorteio: Math.random(),
        publicadoEm: FieldValue.serverTimestamp(),
      });
      escritas++;
    }
    await batch.commit();
    console.log(`   …lote gravado (${Math.min(i + LOTE, publicar.length)}/${publicar.length})`);
  }

  console.log(`\n✅ ${escritas} pergunta(s) publicadas em ${COLECAO}.\n`);
}

main().catch((e) => fatal(e?.stack || String(e)));
