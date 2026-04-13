# Directo Template Builder Flutter SDK

SDK Flutter para renderizar templates do feed Directo AI, aplicar tema, disparar tracking e tratar ações nativas como `report`, `follow` e `open_profile`.

## O que a SDK oferece

- Renderização de posts a partir de `theme`, `templates` e `feed`
- Suporte a templates em JSON e HTML legado
- Tracking de impressão, view time, like, favorite, share e report
- Modal nativa de denúncia
- Página fullscreen nativa de perfil da loja
- Fluxo nativo de seguir e deixar de seguir

## Instalação

Adicione a package no `pubspec.yaml` do app:

```yaml
dependencies:
  directo_template_builder:
    path: ../lib-sdk/flutter-sdk
```

Depois rode:

```bash
flutter pub get
```

## Imports principais

```dart
import 'package:directo_template_builder/directo_template_builder.dart';
```

## Estrutura esperada

Você normalmente vai consumir 3 respostas da API:

1. `theme.response.json`
2. `template.response.json`
3. `feed.response.json`

Mapeamento básico:

- `theme` -> `CVDTheme.fromJson(...)`
- `templates` -> `List<DirectoAiTemplate>`
- `feed` -> `List<Post>`

## Exemplo mínimo

```dart
import 'package:directo_template_builder/directo_template_builder.dart';
import 'package:flutter/material.dart';

class FeedPage extends StatelessWidget {
  final CVDTheme theme;
  final List<DirectoAiTemplate> templates;
  final List<Post> posts;

  const FeedPage({
    super.key,
    required this.theme,
    required this.templates,
    required this.posts,
  });

  @override
  Widget build(BuildContext context) {
    final config = DirectoAiConfig(
      accountId: '0b455c19-e389-4a7f-b83c-ef0cf7286ecb',
      apiKey: '57cbcfd2-fe10-41db-abf3-84bdb569cdae',
      customerId: 'mock-customer-123',
      baseUrl: 'https://api.dev-directoai.com.br',
    );

    return DirectoAiTemplateProvider(
      theme: theme,
      templates: templates,
      config: config,
      tracker: DefaultDirectoAiTracker(config),
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F5F7),
        body: SafeArea(
          child: Center(
            child: SizedBox(
              width: 400,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 20,
                ),
                itemCount: posts.length,
                separatorBuilder: (_, __) => const SizedBox(height: 20),
                itemBuilder: (context, index) {
                  return CVDPost(post: posts[index]);
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

## Como montar os modelos

```dart
final theme = CVDTheme.fromJson(themeResponse['data']);

final templates = (templateResponse['data'] as List)
    .map((item) => DirectoAiTemplate.fromJson(item))
    .toList();

final posts = ((feedResponse['data']['feeds'] as List))
    .map((item) => Post.fromJson(item))
    .toList();
```

## Provider

O `DirectoAiTemplateProvider` é obrigatório. Ele injeta:

- `theme`
- `templates`
- `config`
- `tracker`
- callbacks opcionais

Exemplo:

```dart
DirectoAiTemplateProvider(
  theme: theme,
  templates: templates,
  config: config,
  tracker: DefaultDirectoAiTracker(config),
  child: const MyFeedView(),
)
```

## Configuração

Campos principais de `DirectoAiConfig`:

- `accountId`
- `apiKey`
- `customerId`
- `deviceId`
- `baseUrl`
- `onAnalyticsEvent`

Exemplo:

```dart
final config = DirectoAiConfig(
  accountId: '0b455c19-e389-4a7f-b83c-ef0cf7286ecb',
  apiKey: '57cbcfd2-fe10-41db-abf3-84bdb569cdae',
  customerId: 'customer-123',
  baseUrl: 'https://api.dev-directoai.com.br',
);
```

## Renderizando um post

Use `CVDPost`:

```dart
CVDPost(post: post)
```

Ele resolve automaticamente:

- template JSON pelo `templateId`
- fallback para `template` HTML legado
- contexto de variáveis do post

## Ações nativas já tratadas pela SDK

### Report

Quando a action vier como:

```json
{
  "type": "UI_ACTION",
  "payload": {
    "actionName": "report"
  }
}
```

A SDK abre a modal de denúncia nativamente.

Também funciona com `denunciar`.

### Follow

Quando a action vier como:

```json
{
  "type": "UI_ACTION",
  "payload": {
    "actionName": "follow"
  }
}
```

A SDK:

- faz `POST` ou `DELETE` em `/campaign/api/v1/feed/followers`
- alterna entre `Seguir` e `Deixar de seguir`
- mostra o ícone de seguido no header

### Open Profile

Quando a action vier como:

```json
{
  "type": "UI_ACTION",
  "payload": {
    "actionName": "open_profile"
  }
}
```

A SDK abre uma página fullscreen interna com:

- avatar e nome da loja
- botão de seguir
- publicações específicas da conta

Para isso a SDK chama:

```text
GET /campaign/api/v1/feed/accounts?accountId=...&apiKey=...&profileAccountId=...
```

## Endpoints usados pela SDK

### Favoritos

```text
POST   /campaign/api/v1/feed/favorites
DELETE /campaign/api/v1/feed/favorites
```

### Follow

```text
POST   /campaign/api/v1/feed/followers
DELETE /campaign/api/v1/feed/followers
```

### Share

```text
POST /campaign/api/v1/feed/share
```

### Report

```text
POST /content/api/v1/contents/:contentId/report
```

### Feed da loja

```text
GET /campaign/api/v1/feed/accounts
```

## Report callback opcional

Se quiser interceptar o envio da denúncia:

```dart
DirectoAiTemplateProvider(
  theme: theme,
  templates: templates,
  config: config,
  tracker: DefaultDirectoAiTracker(config),
  onReportSubmit: (submission, dataContext) async {
    debugPrint(submission.reasonId);
  },
  child: const MyFeedView(),
)
```

## Action callback opcional

Para ações que não são tratadas nativamente:

```dart
DirectoAiTemplateProvider(
  theme: theme,
  templates: templates,
  config: config,
  tracker: DefaultDirectoAiTracker(config),
  onAction: (action, dataContext) {
    debugPrint(action.payload.actionName);
  },
  child: const MyFeedView(),
)
```

## Campos importantes no post

Para os fluxos de header, follow e profile, estes campos são úteis:

```json
{
  "contentId": "content_1",
  "accountId": "profile_account_id",
  "title": "Nome do produto",
  "templateId": "template_id",
  "url": "https://...",
  "favorite": false,
  "liked": false,
  "following": false,
  "profile": {
    "accountId": "profile_account_id",
    "accountName": "Super Zeus",
    "iconUrl": "https://...",
    "description": "Descrição da conta"
  }
}
```

## Comportamentos importantes

- Se o post tiver `template` HTML, ele tem prioridade sobre o template JSON.
- Se `favorite: true`, o bookmark já abre favoritado.
- Se `following: true` ou `profile.isFollowing: true`, o header já abre no estado seguido.
- A página de perfil usa a largura visual do feed, mesmo sendo fullscreen.

## Quando usar callbacks do app

Use `onAction` quando:

- a action for específica do seu app
- você quiser abrir rotas nativas do host
- quiser integrar analytics próprios

Deixe a SDK tratar sozinha quando:

- for `report`
- for `follow`
- for `open_profile`

## Arquivos mais importantes da package

- `lib/src/post.dart`
- `lib/src/provider.dart`
- `lib/src/tracker.dart`
- `lib/src/action_handler.dart`
- `lib/src/widgets/report_dialog.dart`
- `lib/src/widgets/profile_view_page.dart`
- `lib/src/widgets/header_node.dart`

## Exemplo de debug rápido

Se uma ação não acontecer:

1. Confirme se o `DirectoAiTemplateProvider` está envolvendo a árvore.
2. Confirme se `accountId`, `apiKey` e `baseUrl` estão corretos.
3. Verifique se o `post` tem `accountId` ou `profile.accountId`.
4. Confira se o `templateId` do post existe na lista de templates.
5. Verifique se a action do schema está vindo como `UI_ACTION`.

## Estado atual da SDK

Hoje a SDK Flutter já cobre:

- renderização do feed
- favorites
- follow/unfollow
- report modal
- profile fullscreen da loja
- share

Se quiser, o próximo passo natural é adicionar um app `example/` oficial da package com integração ponta a ponta. 
