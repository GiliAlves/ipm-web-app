# Banco de Perguntas — Game Bíblico IPM

Fonte de verdade das perguntas do game. Este conteúdo é **autoral/editorial** e mora
no repositório (versionado). Um processo de publicação leva as perguntas **aprovadas**
para o Firestore, já **sem o gabarito** exposto ao cliente (o gabarito só é usado pelo
servidor/Cloud Functions na hora de pontuar).

> ⚠️ **Regra de ouro**: nenhuma pergunta entra no jogo com `status` diferente de
> `aprovado`. Gabarito de doutrina/Escritura exige revisão teológica.

---

## 1. Eixos de classificação

| Eixo | Valores | Observação |
|------|---------|------------|
| `tema` | `biblia` \| `historia` \| `confissoes` | Grande área |
| `subtema` | ex.: `antigo-testamento`, `novo-testamento`, `reforma`, `ipb`, `breve-catecismo`, `westminster` | Livre, mas padronizado |
| `trilhas` | subconjunto de `["UCP","UPA","UMP","Adultos"]` | Uma pergunta pode servir a **várias** trilhas |
| `dificuldade` | `facil` \| `medio` \| `dificil` | Dificuldade **dentro** da trilha |

Como o jogador pode competir em várias trilhas (ranking separado por trilha), a pergunta
declara em quais trilhas ela é apropriada. Ex.: "Quem construiu a arca?" serve UCP e UPA;
"Qual a obra principal de Calvino?" serve UMP e Adultos.

---

## 2. Esquema de uma pergunta

```jsonc
{
  "id": "bib-0001",                 // estável, nunca reutilizar/renumerar
  "tema": "biblia",
  "subtema": "antigo-testamento",
  "trilhas": ["UCP", "UPA"],
  "dificuldade": "facil",
  "enunciado": "Quem foi lançado na cova dos leões e preservado por Deus?",
  "alternativas": [                 // sempre 4; ids estáveis a–d
    { "id": "a", "texto": "Daniel" },
    { "id": "b", "texto": "Davi" },
    { "id": "c", "texto": "Jonas" },
    { "id": "d", "texto": "Elias" }
  ],
  "respostaCorretaId": "a",         // NUNCA vai para o cliente; usado só no servidor
  "explicacao": "Daniel foi lançado na cova dos leões e Deus fechou a boca deles (Dn 6).",
  "referencia": {                   // para incentivar o estudo pós-resposta
    "tipo": "biblia",               // "biblia" | "documento"
    "versao": "ARA",
    "livro": "Daniel", "capitulo": 6, "versiculo": "16-23"
  },
  "tags": ["daniel", "milagre", "fidelidade"],
  "status": "aprovado",             // rascunho | em_revisao | aprovado | arquivado
  "revisadoPor": "",                // preenchido no fluxo de aprovação
  "aprovadoPor": "",
  "dataAprovacao": "",
  "versao": 1,                      // incrementa a cada edição de conteúdo
  "ativo": true
}
```

Para referência de **documento** (confissões, catecismos, história), use:

```jsonc
"referencia": {
  "tipo": "documento",
  "fonte": "Breve Catecismo de Westminster",
  "secao": "Pergunta 1"
}
```

---

## 3. Fluxo de aprovação teológica

```
rascunho ──▶ em_revisao ──▶ aprovado ──▶ (publica no Firestore)
     ▲            │
     └────────────┘  (reprovado volta para rascunho com comentário)
                                   │
                              arquivado  (aposentada, sai do jogo)
```

1. **Autor** cria a pergunta (`rascunho`).
2. **Revisor** (líder/professor) confere fonte e clareza → `em_revisao`.
3. **Aprovador** (pastor/conselho) valida o gabarito doutrinário → `aprovado`,
   preenchendo `aprovadoPor` e `dataAprovacao`.
4. Só perguntas `aprovado` + `ativo: true` são publicadas.

Corrigiu uma pergunta já no ar? Incremente `versao` e reenvie para revisão.

---

## 4. Anti-cheat (lembrete de como o dado é usado)

- O publicador **remove `respostaCorretaId` e `explicacao`** antes de gravar a coleção
  lida pelo app. Esses campos vão para uma coleção/documento lido só pelas Functions.
- A ordem das `alternativas` é **embaralhada por sessão** no servidor.
- Cada quiz sorteia N perguntas de um pool grande → por isso a meta de volume
  (300–500 perguntas) importa. Pool pequeno = fácil de decorar/compartilhar.

---

## 5. Arquivos desta pasta

| Arquivo | Uso |
|---------|-----|
| `questions.seed.json` | Lote inicial de exemplo (perguntas reais, prontas para revisão) |
| `template.csv` | Planilha para cadastro por quem não mexe em JSON; um script converte para JSON |

Fluxo planilha → jogo: **CSV** (editado no Sheets/Excel) → conversor → `*.json` →
revisão/aprovação → publicação no Firestore.
