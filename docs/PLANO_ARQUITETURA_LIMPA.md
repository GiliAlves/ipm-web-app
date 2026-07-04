# Plano de Reconstrução — Arquitetura Limpa + Hexagonal + Signals

## 1. Objetivo

Reconstruir o `ipm-web-app` aplicando **Arquitetura Limpa / Hexagonal**, **Angular Signals** e **boas práticas de engenharia**, preservando o comportamento atual e subindo as dependências para versões modernas e compatíveis.

## 2. Princípios diretores

- **Domínio isolado**: regras de negócio puros, sem dependência de frameworks.
- **Portas e Adaptadores**: infraestrutura implementa interfaces definidas pelo domínio.
- **Inversão de dependência**: camadas internas não conhecem camadas externas.
- **Estado reativo com Signals**: substituir `BehaviorSubject` e `Observable` onde fizer sentido para estado local.
- **Standalone + Function-based**: migrar de `NgModule` para `standalone components` e `provideXxx`.
- **Sem comportamento alterado**: o app deve continuar listando, buscando, favoritando e exibindo os mesmos dados.

## 3. Stack-alvo (upgrade)

| Camada | Versão alvo |
|--------|-------------|
| Angular | `^18.2.0` |
| Angular ESLint | `^18.4.0` |
| Ionic | `^8.2.0` |
| Capacitor | `^7.0.0` |
| TypeScript | `~5.5.0` |
| RxJS | `^7.8.0` (mantido para eventos/HTTP) |
| zone.js | `~0.14.10` |
| Firebase | `@angular/fire ^18.0.0` |
| Compodoc | `@compodoc/compodoc ^1.2.1` |

> **Nota**: subir tudo de uma vez é arriscado. O plano faz o upgrade **antes** da refatoração estrutural para detectar incompatibilidades logo no início.

## 4. Estrutura de pastas proposta

```
src/app/
  core/
    domain/
      entities/           # Entidades puras (Cantico, Hino, Boletim, etc.)
      value-objects/      # Objetos de valor (Id, Email, Data, etc.)
      enums/              # Enums de domínio
      ports/              # Interfaces de repositórios e serviços externos
      errors/             # Erros de domínio personalizados
    application/
      use-cases/          # Um caso de uso por arquivo (GetCanticoList, GetBoletim, ...)
      mappers/             # Conversores entity ↔ DTO
      dto/                 # Entradas e saídas dos casos de uso
      tokens/              # InjectionTokens para ports
  infrastructure/
    repositories/         # Implementações Firebase dos ports
    external/             # YouTube, Storage, Capacitor plugins
    mappers/              # Mappers específicos de infra
    config/               # Providers e configuração de adapters
  presentation/
    pages/                # Páginas standalone (inicio, biblia, boletim, etc.)
    components/           # Componentes reutilizáveis
    pipes/                # Pipes puros
    resolvers/            # Resolvers de rota
    signals/              # Stores/composables signal-based por página
    providers/            # Provider functions para injeção de dependências
  app.config.ts           # Configuração standalone
  app.routes.ts           # Rotas standalone
  main.ts
```

## 5. Diretrizes de implementação

### 5.1 Componentes e reutilização

- Sempre verificar se já existe um componente que resolve o problema antes de criar um novo.
- Ao criar componente novo, projetá-lo para ser reutilizável: inputs/outputs genéricos, sem lógica de negócio acoplada, sem dependência de contexto específico.
- Componentes apresentacionais devem ser puros: `OnPush`, sem side-effects, sem injeção de serviços de dados.
- Se um componente é usado por apenas 1 feature, fica em `features/<feature>/components/`. Se usado por 2+, sobe para `shared/components/`.
- Extrair sub-componentes quando um template ultrapassa ~300 linhas ou quando um bloco visual é auto-contido.
- Pipes e directives reutilizáveis vão para `shared/pipes/` ou `shared/directives/`.

### 5.2 Design patterns

- Preferir composição sobre herança — componentes pequenos compostos, não hierarquias profundas.
- Observer pattern (RxJS/Signals) para estado reativo — nunca polling manual.
- Strategy/Adapter para variações de comportamento (ex.: ports/adapters já existentes).
- Factory quando a criação de objetos for complexa ou condicional.
- Facade para simplificar interfaces complexas de subsistemas (ex.: os CommandServices já fazem isso).
- Singleton apenas para serviços `providedIn: 'root'` que precisam de estado global.

### 5.3 Programação funcional

- Preferir funções puras e imutabilidade em toda lógica de transformação de dados.
- Evitar mutação de estado — usar spread (`...`), `map`, `filter`, `reduce`.
- Extrair lógica de transformação para funções puras testáveis em `util/` ou `domain/services/`.
- Evitar `for` imperativo quando `map`/`filter`/`reduce` expressam melhor a intenção.
- Side-effects devem ficar isolados na borda (adapters, componentes), nunca no meio de uma cadeia de transformação.

### 5.4 Código limpo

- Nomes descritivos: português para domínio de negócio (ex.: `calcularSaldoDisponivel`), inglês para código técnico (ex.: `mapToViewModel`).
- Funções pequenas com responsabilidade única — idealmente até 30 linhas.
- Sem código morto, sem `console.log`, sem código comentado em commits.
- TODO/FIXME só com issue vinculada (`// TODO(#123): descrição`). Não deixar TODOs órfãos.
- Early return para reduzir aninhamento — evitar `if/else` profundos.
- Extrair magic numbers e strings para constantes nomeadas.
- Um arquivo = uma responsabilidade. Não misturar múltiplas classes/interfaces não relacionadas.

### 5.5 Complexidade

- Complexidade ciclomática <= 30 (enforced pelo SonarJS no ESLint).
- Se uma função precisa de mais de 3 níveis de indentação, extrair sub-funções.
- Preferir estruturas de dados (`Map`, `Set`, lookup tables) sobre cadeias de `if/else`.
- Switch com `never` no default para exaurir union types — o compilador avisa se faltar caso.
- Decompor funções longas em pipeline de transformações nomeadas (cada passo com nome de negócio).

### 5.6 SCSS e estilos

- Reutilizar variáveis e mixins de `src/theme/variables.scss` — nunca hard-coded.
- Não duplicar padrões visuais (glass, glow, cards, shadows) — extrair para classes compartilhadas ou mixins.
- Usar variáveis CSS do Ionic (`--ion-*`) para temas e cores.
- Mobile-first: começar pelo layout mobile, ajustar para desktop com media queries.
- Usar `@use` em vez de `@import` (deprecated no Sass).
- Tokens de design (cores, espaçamentos, border-radius, shadows) devem vir de variáveis centralizadas.
- Não usar `!important` exceto para override de libs terceiras (Ionic) — documentar o motivo.
- Componentes não devem estilizar filhos de outros componentes. `:host ::ng-deep` só como último recurso documentado.
- Usar `rem`/`em` para tipografia, nunca `px` fixo para fontes.
- Nomes de classes: seguir a convenção do projeto (BEM ou convenção existente).

### 5.7 DRY (Don't Repeat Yourself)

- Se um bloco de código aparece em 2+ lugares, extrair para função/componente/pipe/diretiva.
- Se um padrão SCSS aparece em 3+ arquivos, extrair para mixin ou classe utilitária.
- Se uma lógica de negócio aparece em 2+ features, mover para `shared/` ou `domain/`.
- Constantes e enums de domínio (roles, status, tipos) devem ter uma única fonte de verdade — não duplicar strings.
- Tipos compartilhados vivem em `shared/models/` ou `domain/models/` — não redefinir localmente.

### 5.8 Gate anti-duplicação (OBRIGATÓRIO antes de criar UI ou lógica)

> Regras genéricas não bastam — este gate é um passo executável que o agente roda ANTES de escrever marcação, SCSS ou lógica de tela.

Antes de criar um componente, bloco de markup, SCSS ou helper, executar nesta ordem:

1. **Procurar primeiro.** `grep`/`rg` por uma classe, seletor ou nome de função característico do que você vai escrever. Se já existe em **outro** arquivo, você está prestes a duplicar — pare e reutilize/extraia.
   - UI de tela-lista (header, busca, lista, paginação) → componha a família `ipm-list-page-shell` & cia. Não recriar `rep-*`.
   - Estilo (glass, glow, card, badge, overlay) → mixin/classe em `src/theme` ou partial compartilhado. Nunca redefinir `.rep-*`/`.glass`/etc. num `.component.scss`.
   - Formatação (BRL, CPF, CNPJ, data) → pipe em `shared/pipes/`. Não formatar inline com `replace(/\D/...)` nem `toLocaleString` solto.
   - Lista (busca/ordenação/paginação) → composable compartilhado, não signals copiados.
2. **Regra dos números.** Markup/lógica em 2+ lugares OU padrão SCSS em 3+ arquivos → extrair AGORA (e a regra DRY, agora obrigatória, não sugerida).
3. **Localização.** Usado por 1 feature → `features/<feature>/components/`. Por 2+ → `shared/components/` (ou `shared/pipes`/`shared/directives`/util).
4. **Na Definição de pronto**, declarar explicitamente que o gate passou. Um PR que adiciona um novo clone deve ser rejeitado.

Sinal de cheiro para parar e revisar: o arquivo novo começa com um comentário tipo "igual a tela X" / "estilo /membros". Isso é confissão de copy-paste — extraia em vez de copiar.

## 6. Fases de execução

### Fase 0 — Preparação e baseline
- Criar branch `feature/clean-architecture-signals`.
- Garantir que `npm run build`, `npm run lint` e `npm run test` passem no estado atual.
- Congelar o estado do `package-lock.json` de referência.

### Fase 1 — Upgrade de dependências
- Atualizar `package.json` para Angular 18, Ionic 8, Capacitor 7, TypeScript 5.5, etc.
- Ajustar `angular.json`, `tsconfig.json`, `capacitor.config.ts` e `firebase.json` se necessário.
- Substituir `app.module.ts` por `app.config.ts` e `main.ts` standalone.
- Migrar `app-routing.module.ts` para `app.routes.ts`.
- Verificar build/lint/test.

### Fase 2 — Estrutura de pastas e domínio
- Criar `core/domain/entities`, `ports`, `errors`.
- Modelar entidades a partir dos dados consumidos hoje: `Cantico`, `NovoCantico`, `Boletim`, `Pastoral`, `Devocional`, `Calendario`, `Lider`, `Livro`, `Video`.
- Definir ports: `ICanticoRepository`, `IBoletimRepository`, `IYoutubeService`, `IStorageService`, etc.
- Criar injection tokens (`*RepositoryToken`, `*ServiceToken`).

### Fase 3 — Aplicação (use cases)
- Criar um caso de uso por fluxo de tela: `GetHomeDataUseCase`, `SearchCanticoUseCase`, `GetBoletimDetailUseCase`, `GetBibleBookUseCase`, etc.
- Cada use case recebe apenas as ports de que precisa.
- Retornar `Observable<T>` ou `Signal<T>` conforme convenção de cada página.

### Fase 4 — Infraestrutura (adapters)
- Implementar adapters concretos usando `FirebaseService`, `YoutubeService`, `StorageService`, etc.
- Mapear objetos Firestore para entidades de domínio.
- Injetar adapters via tokens no `app.config.ts`.

### Fase 5 — Refatoração das páginas (presentation + signals)
- Converter cada página para `standalone component`.
- Criar um signal store para cada página (ex: `useHomeStore`, `useCanticoStore`).
- Usar `input()`/`output()`, `computed()`, `effect()` e `resource()`/`rxResource()` onde apropriado.
- Substituir `BehaviorSubject` de estado local por `signal`/`computed`.
- Manter RxJS para streams de dados vindos do backend (use case retorna `Observable`).
- Migrar pipes e resolvers para standalone.

### Fase 6 — Limpeza e qualidade
- Remover `app.module.ts`, `app-routing.module.ts` e módulos legados.
- Atualizar `README.md` com a nova arquitetura e stack.
- Atualizar `.eslintrc.json` para Angular ESLint 18 e flat config se desejado.
- Executar `npm run lint`, `npm run test`, `npm run build`, `npm run docs:build`.
- Criar testes de unidade para entidades e use cases (Karma/Jasmine).

### Fase 7 — Validação e deploy
- Testar rotas principais (inicio, cancioneiro, novo-cantico, biblia, boletim, lideranca, sobre).
- Verificar push notifications e service worker.
- Verificar build de produção (`npm run build`) e sync do Capacitor (`npx cap sync`).
- Abrir PR.

## 7. Sub-agentes e prompts

> Cada sub-agente recebe o contexto do projeto (`/Users/gilialves/Projetos/ipm-web-app`) e deve trabalhar em uma fase isolada.

---

### Sub-agente 1 — Upgrade Engineer

```text
Você é um engenheiro sênior especializado em atualização de dependências Angular/Ionic/Capacitor.

Contexto: projeto Ionic/Angular em /Users/gilialves/Projetos/ipm-web-app.
Tarefa: atualizar todas as dependências para as versões-alvo definidas no plano (Angular 18, Ionic 8, Capacitor 7, TypeScript 5.5, Angular ESLint 18, etc.).

Ações:
1. Leia package.json, angular.json, tsconfig.json, capacitor.config.ts, .eslintrc.json.
2. Atualize versões no package.json mantendo compatibilidade de peer dependencies.
3. Substitua app.module.ts por app.config.ts e main.ts standalone.
4. Converta app-routing.module.ts para app.routes.ts.
5. Ajuste providers (Firebase, Storage, Service Worker, NgxIndexedDB, etc.) para formato standalone.
6. Rode npm install, npm run build, npm run lint. Corrija erros até passar.

Restrições:
- NÃO altere comportamento de negócio.
- NÃO remova funcionalidades.
- Mínimo de código possível: apenas o necessário para o upgrade.
- Prefira providers factory e provideXxx.

Entrega:
- package.json, angular.json, tsconfig.json, capacitor.config.ts, app.config.ts, app.routes.ts, main.ts.
- Resumo de mudanças e comandos de verificação.
```

---

### Sub-agente 2 — Domain Architect

```text
Você é um arquiteto de software especializado em Domain-Driven Design e Arquitetura Limpa.

Contexto: projeto /Users/gilialves/Projetos/ipm-web-app recém-atualizado para Angular 18/Ionic 8.
Tarefa: criar a camada de domínio pura e as portas de comunicação.

Ações:
1. Analise as interfaces de dados existentes (src/app/interfaces/, src/app/model/db-biblia/, src/app/pages/*/).
2. Crie a estrutura src/app/core/domain/entities, value-objects, enums, ports, errors.
3. Modele entidades: Cantico, NovoCantico, Boletim, Pastoral, Devocional, Calendario, Lider, Livro, Video, etc.
4. Crie ports (interfaces TypeScript) para cada repositório/serviço externo.
5. Crie injection tokens em src/app/core/application/tokens/.
6. Garanta que o domínio não importe nada de @angular/*, @ionic/*, firebase, etc.

Restrições:
- Domínio puro: sem dependências de framework.
- Use classes, interfaces e/ou tipos conforme o idioma Angular.
- Campos obrigatórios e validações simples de domínio onde fizer sentido.

Entrega:
- Estrutura de pastas criada.
- Código das entidades e ports.
- Diagrama textual das camadas.
```

---

### Sub-agente 3 — Application Engineer

```text
Você é um engenheiro sênior de aplicação, especialista em casos de uso e mapeamento de dados.

Contexto: projeto /Users/gilialves/Projetos/ipm-web-app com camada de domínio já criada.
Tarefa: implementar a camada de aplicação (use cases) consumindo as ports do domínio.

Ações:
1. Crie src/app/core/application/use-cases/ com um caso de uso por fluxo de tela.
2. Crie DTOs de entrada e saída em src/app/core/application/dto/.
3. Crie mappers entity ↔ DTO em src/app/core/application/mappers/.
4. Cada use case deve ser uma classe injetável com os tokens das ports no construtor.
5. Exemplos de use cases: GetHomeDataUseCase, SearchCanticoUseCase, GetBoletimDetailUseCase, GetBibleBookUseCase, GetLeadershipUseCase, GetVideosUseCase.

Restrições:
- A camada de aplicação só conhece ports e entidades do domínio.
- Não use Firebase, HttpClient ou Storage diretamente aqui.
- Retorne Observable<T> para streams e métodos síncronos para operações puras.

Entrega:
- Código de todos os use cases iniciais.
- Testes de unidade Jasmine para use cases críticos.
```

---

### Sub-agente 4 — Infrastructure Adapter

```text
Você é um engenheiro sênior de infraestrutura, especialista em adapters e integração com APIs/Firebase.

Contexto: projeto /Users/gilialves/Projetos/ipm-web-app com domínio e aplicação prontos.
Tarefa: implementar os adapters concretos para Firebase, YouTube, Storage e Capacitor.

Ações:
1. Crie src/app/infrastructure/repositories/ implementando cada port de repositório.
2. Crie src/app/infrastructure/external/ para YouTube, Storage e plugins Capacitor.
3. Reutilize/adapte os serviços existentes: FirebaseService, YoutubeService, StorageService.
4. Mapeie os dados brutos (Firestore, YouTube, localStorage) para entidades de domínio.
5. Configure a injeção dos adapters via tokens em app.config.ts.

Restrições:
- Cada adapter implementa uma port do domínio.
- Trate erros de infraestrutura e converta em DomainError quando apropriado.
- Não exponha detalhes de Firebase/YouTube para as camadas superiores.

Entrega:
- Código dos adapters.
- Configuração de providers em app.config.ts.
- Testes de integração leves (ou stubs) para validar mapeamento.
```

---

### Sub-agente 5 — Presentation & Signals Engineer

```text
Você é um engenheiro sênior de frontend Angular, especialista em Signals, standalone components e UX.

Contexto: projeto /Users/gilialves/Projetos/ipm-web-app com domínio, aplicação e infraestrutura prontos.
Tarefa: refatorar as páginas para standalone components, usar Signals e consumir os use cases.

Ações:
1. Converta cada página de src/app/pages/* para standalone component.
2. Crie src/app/presentation/signals/ com uma store signal-based por página (ex: useHomeStore, useCanticoStore).
3. Substitua BehaviorSubjects de estado local por signals.
4. Use input() para inputs de componentes, output() para eventos, computed() para derivações, effect() para efeitos colaterais locais.
5. Mantenha RxJS para consumir use cases via rxResource() ou toSignal() com o DestroyRef.
6. Atualize templates (.html) para bindings de signals sem `| async` onde possível.
7. Converta pipes e resolvers para standalone.

Restrições:
- Nenhuma página deve chamar Firebase/YouTube/Storage diretamente.
- Páginas só injetam use cases e/ou signal stores.
- Preserve todo o comportamento visual (busca, filtros, favoritos, modal, PDF, etc.).

Entrega:
- Código refatorado das páginas, stores, pipes e resolvers.
- Resumo de signals adotados.
- Verificação de build/lint.
```

---

### Sub-agente 6 — QA & Docs Engineer

```text
Você é um engenheiro sênior de qualidade e documentação.

Contexto: projeto /Users/gilialves/Projetos/ipm-web-app com refatoração concluída.
Tarefa: garantir qualidade, documentar e finalizar a entrega.

Ações:
1. Remova arquivos mortos: app.module.ts, app-routing.module.ts, módulos legados não usados.
2. Atualize README.md com a nova arquitetura, stack, estrutura de pastas e scripts.
3. Atualize .eslintrc.json para compatibilidade com Angular ESLint 18.
4. Execute npm run lint, npm run test, npm run build, npm run docs:build.
5. Crie/ajuste testes de unidade para entidades, use cases e signal stores.
6. Valide rotas principais e funcionalidades críticas.

Restrições:
- Não relaxe regras de lint sem justificativa.
- Documente decisões arquiteturais e deixe JSDoc nos novos arquivos.

Entrega:
- README.md atualizado.
- Suite de testes rodando.
- Build e documentação gerada com sucesso.
- Relatório de cobertura e bugs encontrados.
```

## 8. Critérios de aceitação

- [ ] `npm run lint` passa sem warnings graves.
- [ ] `npm run test` passa (mínimo 70% de cobertura em core).
- [ ] `npm run build` gera `www/` sem erros.
- [ ] `npm run docs:build` gera `documentation/` refletindo a nova arquitetura.
- [ ] Navegação entre páginas (inicio, cancioneiro, novo-cantico, biblia, boletim, lideranca, sobre) funciona.
- [ ] Favoritos, busca, filtros, vídeos e PDF continuam funcionando.
- [ ] Push notifications e service worker não quebram.
- [ ] Nenhuma referência direta a Firebase/YouTube/Storage nas páginas ou use cases.
- [ ] Todas as páginas são standalone components.

## 9. Comandos de verificação por fase

```bash
# Fase 1
npm install
npm run build
npm run lint

# Fase 2-4
npm run build

# Fase 5-6
npm run lint
npm run test
npm run build
npm run docs:build
```

## 10. Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Upgrade quebrar build | Fazer upgrade isolado antes da refatoração; resolver erros antes de prosseguir. |
| Perda de dados locais | Manter contratos de Storage; testar migração de chaves. |
| YouTube API key exposta | Continuar com chave hard-coded (débito técnico) ou mover para environment + proxy. |
| Comportamento alterado | Testes manuais por página e comparar com versão anterior. |
| Muito grande para uma única PR | Dividir em PRs por fase ou por página. |

---

## 11. Próximo passo

Aprovar este plano e iniciar a **Fase 1 — Upgrade de dependências**, delegando ao Sub-agente 1.
