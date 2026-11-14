#!/usr/bin/env node
// Conversor CSV -> JSON do banco de perguntas do game bíblico IPM.
//
// Uso:
//   node content/game/csv-to-json.mjs content/game/template.csv content/game/questions.seed.json
//   node content/game/csv-to-json.mjs entrada.csv                      (imprime no stdout)
//
// - Sem dependências externas (Node >= 18).
// - Separador: ';' (padrão pt-BR). Suporta campos entre aspas duplas com "" escapado.
// - Valida cada linha e ABORTA se houver erro (não gera JSON parcial silencioso).

import { readFileSync, writeFileSync } from 'node:fs';

const DELIM = ';';
const TEMAS = new Set(['biblia', 'historia', 'confissoes']);
const TRILHAS = new Set(['UCP', 'UPA', 'UMP', 'Adultos']);
const DIFICULDADES = new Set(['facil', 'medio', 'dificil']);
const STATUS = new Set(['rascunho', 'em_revisao', 'aprovado', 'arquivado']);
const OPCOES = ['a', 'b', 'c', 'd'];

const COLUNAS = [
  'id', 'tema', 'subtema', 'trilhas', 'dificuldade', 'enunciado',
  'alt_a', 'alt_b', 'alt_c', 'alt_d', 'resposta_correta', 'explicacao',
  'ref_tipo', 'ref_fonte_ou_livro', 'ref_secao_ou_capitulo', 'ref_versiculo',
  'ref_versao', 'tags', 'status',
];

/** Faz o parse de um CSV inteiro respeitando aspas e quebras de linha dentro de aspas. */
function parseCsv(text, delim = DELIM) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  // Normaliza fim de linha e remove BOM.
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } // aspas escapada ""
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  // Último campo/linha (se o arquivo não terminar com \n).
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  // Descarta linhas totalmente vazias.
  return rows.filter((r) => r.some((v) => v.trim() !== ''));
}

const splitList = (v) =>
  (v ?? '').split('|').map((s) => s.trim()).filter(Boolean);

function construirReferencia(reg, erros, ctx) {
  const tipo = reg.ref_tipo.trim();
  if (!tipo) return undefined; // referência é opcional
  if (tipo === 'biblia') {
    const ref = { tipo: 'biblia' };
    if (reg.ref_versao.trim()) ref.versao = reg.ref_versao.trim();
    if (reg.ref_fonte_ou_livro.trim()) ref.livro = reg.ref_fonte_ou_livro.trim();
    if (reg.ref_secao_ou_capitulo.trim()) {
      const cap = Number(reg.ref_secao_ou_capitulo.trim());
      ref.capitulo = Number.isFinite(cap) ? cap : reg.ref_secao_ou_capitulo.trim();
    }
    if (reg.ref_versiculo.trim()) ref.versiculo = reg.ref_versiculo.trim();
    return ref;
  }
  if (tipo === 'documento') {
    const ref = { tipo: 'documento' };
    if (reg.ref_fonte_ou_livro.trim()) ref.fonte = reg.ref_fonte_ou_livro.trim();
    if (reg.ref_secao_ou_capitulo.trim()) ref.secao = reg.ref_secao_ou_capitulo.trim();
    return ref;
  }
  erros.push(`${ctx}: ref_tipo inválido "${tipo}" (use "biblia" ou "documento")`);
  return undefined;
}

function converter(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length === 0) throw new Error('CSV vazio.');

  const header = rows[0].map((h) => h.trim());
  const faltando = COLUNAS.filter((c) => !header.includes(c));
  if (faltando.length) {
    throw new Error(`Cabeçalho inválido. Colunas faltando: ${faltando.join(', ')}`);
  }
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const erros = [];
  const idsVistos = new Set();
  const perguntas = [];

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const linha = r + 1; // número de linha "humano" (1-based com cabeçalho)
    const reg = Object.fromEntries(COLUNAS.map((c) => [c, (cols[idx[c]] ?? '').trim()]));
    const ctx = `Linha ${linha} (id="${reg.id || '?'}")`;

    // Validações
    if (!reg.id) erros.push(`${ctx}: id vazio`);
    else if (idsVistos.has(reg.id)) erros.push(`${ctx}: id duplicado`);
    idsVistos.add(reg.id);

    if (!TEMAS.has(reg.tema)) erros.push(`${ctx}: tema inválido "${reg.tema}"`);
    if (!DIFICULDADES.has(reg.dificuldade)) erros.push(`${ctx}: dificuldade inválida "${reg.dificuldade}"`);
    if (!reg.enunciado) erros.push(`${ctx}: enunciado vazio`);

    const trilhas = splitList(reg.trilhas);
    if (trilhas.length === 0) erros.push(`${ctx}: nenhuma trilha informada`);
    for (const t of trilhas) if (!TRILHAS.has(t)) erros.push(`${ctx}: trilha inválida "${t}"`);

    const alternativas = OPCOES.map((op) => ({ id: op, texto: reg[`alt_${op}`] }));
    for (const alt of alternativas) {
      if (!alt.texto) erros.push(`${ctx}: alternativa "${alt.id}" vazia`);
    }

    const correta = reg.resposta_correta.toLowerCase();
    if (!OPCOES.includes(correta)) {
      erros.push(`${ctx}: resposta_correta inválida "${reg.resposta_correta}" (use a, b, c ou d)`);
    }

    const status = reg.status || 'rascunho';
    if (!STATUS.has(status)) erros.push(`${ctx}: status inválido "${status}"`);

    const referencia = construirReferencia(reg, erros, ctx);

    const pergunta = {
      id: reg.id,
      tema: reg.tema,
      subtema: reg.subtema || '',
      trilhas,
      dificuldade: reg.dificuldade,
      enunciado: reg.enunciado,
      alternativas,
      respostaCorretaId: correta,
      explicacao: reg.explicacao || '',
      ...(referencia ? { referencia } : {}),
      tags: splitList(reg.tags),
      status,
      revisadoPor: '',
      aprovadoPor: '',
      dataAprovacao: '',
      versao: 1,
      ativo: true,
    };
    perguntas.push(pergunta);
  }

  if (erros.length) {
    const err = new Error(`Foram encontrados ${erros.length} erro(s):\n - ${erros.join('\n - ')}`);
    err.validacao = true;
    throw err;
  }

  return {
    meta: {
      descricao:
        "Perguntas do game bíblico IPM geradas a partir de CSV. Só use em produção após aprovação teológica (status 'aprovado').",
      versaoSchema: 1,
      gerado: 'csv-to-json',
      total: perguntas.length,
    },
    perguntas,
  };
}

// ---- CLI ----
function main() {
  const [entrada, saida] = process.argv.slice(2);
  if (!entrada) {
    console.error('Uso: node content/game/csv-to-json.mjs <entrada.csv> [saida.json]');
    process.exit(2);
  }
  let csvText;
  try {
    csvText = readFileSync(entrada, 'utf8');
  } catch (e) {
    console.error(`Não foi possível ler "${entrada}": ${e.message}`);
    process.exit(2);
  }

  let resultado;
  try {
    resultado = converter(csvText);
  } catch (e) {
    console.error(e.validacao ? `❌ ${e.message}` : `❌ Erro: ${e.message}`);
    process.exit(1);
  }

  const json = JSON.stringify(resultado, null, 2) + '\n';
  if (saida) {
    writeFileSync(saida, json, 'utf8');
    const aprovadas = resultado.perguntas.filter((p) => p.status === 'aprovado').length;
    console.log(`✅ ${resultado.perguntas.length} pergunta(s) convertida(s) → ${saida}`);
    console.log(`   (${aprovadas} aprovada(s); as demais precisam passar pela revisão)`);
  } else {
    process.stdout.write(json);
  }
}

main();
