# IPM Web App

Aplicativo web/mobile híbrido da **Igreja Presbiteriana de Mauá (IPM)**, construído com [Ionic](https://ionicframework.com/) e [Angular](https://angular.io/). O app funciona como um centro de informações e ferramentas para os membros e visitantes da igreja, incluindo leitura bíblica, cânticos, hinos, boletins, devocionais, vídeos e histórico institucional.

---

## Stack e tecnologias

- **Ionic 7** + **Angular 17** (com `@ionic/angular`)
- **Capacitor 6** para build mobile (iOS / Android) com plugins nativos
- **Firebase** (AngularFire): Firestore, Cloud Messaging, Cloud Storage, Functions
- **PWA**: service worker, web manifest e notificações push
- **Storage local**: `@ionic/storage-angular` e `ngx-indexed-db`
- **UI/UX**: Ionicons, Swiper, `ngx-color-picker`, `ng-lazyload-image`, `ng2-pdf-viewer`
- **Outros**: RxJS, Lodash, Google APIs (YouTube Data API v3)

---

## Pré-requisitos

- Node.js `>= 18.19.0`
- npm `>= 10.2.0`
- Conta Firebase configurada (veja `src/environments/environment.ts`)
- Chave do YouTube Data API v3 (substituir em `src/app/services/youtube.service.ts`)

---

## Instalação

```bash
npm install
```

## Atualização de dependências

```bash
# Atualiza pacotes dentro dos ranges definidos no package.json
npm update

# Reinstala tudo caso mude versões principais
rm -rf node_modules package-lock.json
npm install
```

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento (`ng serve`) |
| `npm run build` | Gera build de produção na pasta `www` |
| `npm run watch` | Build em modo de desenvolvimento com watch |
| `npm test` | Executa os testes com Karma |
| `npm run lint` | Executa o ESLint no projeto |
| `npm run docs:build` | Gera a documentação do Compodoc em `documentation/` |
| `npm run docs:serve` | Gera e serve a documentação do Compodoc localmente |

---

## Estrutura do projeto

```
src/app/
├── pages/           # Telas principais do aplicativo
│   ├── inicio/      # Home com devocionais, pastorais, vídeos e busca rápida
│   ├── biblia/      # Bíblia Sagrada (livros, capítulos, versículos, comentários)
│   ├── boletim/     # Boletins informativos da igreja
│   ├── cancioneiro/ # Hinário / cânticos tradicionais
│   ├── novo-cantico/# Hinos novos com partituras em PDF
│   ├── lideranca/   # Diretório de liderança (pastores, presbíteros, diáconos)
│   ├── perfil/      # Perfil do usuário
│   ├── login/       # Autenticação
│   ├── cadastro/    # Cadastro de novos usuários
│   └── sobre/       # História da IPM e do Presbiterianismo
├── services/        # Serviços de integração (Firebase, YouTube, Storage)
├── interfaces/      # Contratos de dados TypeScript
├── model/           # Constantes, mocks e dados estáticos (ex.: livros bíblicos)
├── pipes/           # Pipes customizados
├── resolvers/       # Resolvers de rota (boletim e livro bíblico)
└── utils/           # Funções utilitárias reutilizáveis
```

> **Nota:** a pasta `src/app/rosolvers/` contém os resolvers de rota; há uma oportunidade de renomeá-la para `resolvers/`.

---

## Mapeamento de funcionalidades

### 1. Início (`/inicio`)
- Saudação dinâmica de acordo com o horário do dia.
- Listagem de **mensagens pastorais** e **devocionais** (Firestore, limitado a 6 itens).
- Vídeos recentes do canal do YouTube da IPM (via YouTube Data API).
- Busca rápida por número de **cântico** (Cancioneiro) ou **hino** (Novo Cântico).
- Calendário de eventos (seção preparada, mas comentada no código).
- Armazenamento local do último conteúdo acessado (`inicialStorage`).

### 2. Bíblia (`/biblia`)
- Navegação por **Antigo e Novo Testamento**.
- Agrupamento por categorias (Pentateuco, Históricos, Poéticos, Profetas, Evangelhos, Epístolas, etc.).
- Dados bíblicos locais: livros, títulos, versículos e comentários (`src/app/model/db-biblia/`).
- Resolver de rota (`LivroResolver`) carrega o livro selecionado antes de abrir a página.

### 3. Boletim (`/boletim`)
- Listagem de boletins da igreja armazenados no Firestore.
- Detalhamento de boletim via `BoletimResolver`.

### 4. Cancioneiro (`/cancioneiro`)
- Lista completa de cânticos com busca por **número** ou **texto/título**.
- Filtros de temas pré-definidos e personalizados.
- Favoritos, recentes e histórico de busca (persistido no `Ionic Storage`).
- Personalização da letra: tamanho, cor, fonte, negrito, itálico e fundo escuro.
- Ações de **copiar** e **compartilhar** a letra (Capacitor Clipboard/Share).

### 5. Novo Cântico (`/novo-cantico`)
- Funcionalidades similares ao Cancioneiro, voltadas para hinos novos.
- Busca por **temática** e **assunto**.
- Exibição de **partituras em PDF** (`ng2-pdf-viewer`).
- Ações de copiar e compartilhar.

### 6. Liderança (`/lideranca`)
- Diretório de membros da liderança filtrados por cargo:
  - Pastores
  - Presbíteros
  - Diáconos
- Dados sincronizados com a coleção `membros` do Firestore.

### 7. Perfil, Login e Cadastro
- Páginas de estrutura preparadas para autenticação e gerenciamento de perfil do usuário.
- Atualmente em esqueleto, prontas para receber a integração com Firebase Auth.

### 8. Sobre (`/sobre`)
- História da Igreja Presbiteriana do Brasil (IPB).
- História de organização da Igreja Presbiteriana de Mauá (IPM).
- Imagens do acervo institucional.

### 9. Notificações push (PWA / Firebase)
- Registro do service worker de mensagens (`firebase-messaging-sw.js`).
- Solicitação de token FCM e listener de mensagens em primeiro plano.

---

## Configuração do Firebase

O projeto espera as configurações do Firebase em `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '<SUA_API_KEY>',
    authDomain: '<SEU_AUTH_DOMAIN>',
    projectId: '<SEU_PROJECT_ID>',
    storageBucket: '<SEU_BUCKET>',
    messagingSenderId: '<SEU_SENDER_ID>',
    appId: '<SEU_APP_ID>',
    measurementId: '<SEU_MEASUREMENT_ID>'
  },
  vapidKey: '<SUA_VAPID_KEY>'
};
```

> **Atenção:** nunca commite chaves de API em repositórios públicos. Utilize variáveis de ambiente ou segredos do Firebase / CI.

---

## Documentação com Compodoc

A documentação do código é gerada pelo [Compodoc](https://compodoc.app/):

```bash
# Gerar documentação estática
npm run docs:build

# Gerar e abrir servidor local
npm run docs:serve
```

A pasta de saída padrão é `documentation/`. A documentação cobre módulos, componentes, serviços, interfaces, pipes, resolvers e utilitários.

---

## Build mobile com Capacitor

```bash
# Adicionar plataformas (apenas na primeira vez)
npx cap add android
npx cap add ios

# Sincronizar build com as plataformas nativas
npm run build
npx cap sync

# Abrir o projeto nativo
npx cap open android
npx cap open ios
```

---

## Deploy

O projeto está configurado com o deploy do Firebase (`ng deploy`) via `angular.json`. Para fazer o deploy:

```bash
ng deploy
```

---

## Pontos de atenção / débito técnico conhecido

- `app-routing.module.ts` possui rotas duplicadas para `perfil`, `lideranca`, `biblia` e `boletim`.
- `app.component.ts` importa `environment.prod` e chama `storageService.clear()` no construtor, o que limpa o cache local toda vez que o app inicia.
- `youtube.service.ts` contém uma chave de API do YouTube hard-coded.
- A página de calendário na home está preparada, mas comentada no `ngOnInit`.
- A pasta `src/app/rosolvers/` pode ser renomeada para `resolvers/` para refletir melhor a terminatura do Angular.

---

## Licença

[MIT](LICENSE)
