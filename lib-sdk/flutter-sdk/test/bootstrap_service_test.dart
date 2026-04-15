import 'dart:convert';

import 'package:directo_template_builder/src/bootstrap_service.dart';
import 'package:directo_template_builder/src/models/models.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

class FakeHttpClient extends http.BaseClient {
  FakeHttpClient(this._handler);

  final Future<http.Response> Function(Uri uri) _handler;

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    final response = await _handler(request.url);
    return http.StreamedResponse(
      Stream.value(utf8.encode(response.body)),
      response.statusCode,
      headers: response.headers,
      reasonPhrase: response.reasonPhrase,
    );
  }
}

void main() {
  final config = DirectoAiConfig(
    accountId: 'acc_1',
    apiKey: 'api_key',
    baseUrl: 'https://api.dev-directoai.com.br',
  );

  test('bootstrap service should fetch theme and templates', () async {
    final visitedUrls = <String>[];
    final service = DirectoAiBootstrapService(
      client: FakeHttpClient((uri) async {
        visitedUrls.add(uri.toString());

        if (uri.path.contains('/theme/')) {
          return http.Response(
            jsonEncode({
              'data': {
                'colors': {'primary': '#0D63D6'},
                'spacing': {},
                'borderRadius': {},
                'typography': {},
              },
            }),
            200,
          );
        }

        return http.Response(
          jsonEncode({
            'data': [
              {
                'templateId': 'tpl_1',
                'name': 'Template remoto',
                'active': true,
                'slug': 'template-remoto',
                'data': [],
              },
            ],
          }),
          200,
        );
      }),
    );

    final result = await service.load(config);

    expect(result.theme.colors['primary'], '#0D63D6');
    expect(result.templates.single.templateId, 'tpl_1');
    expect(
      visitedUrls,
      contains(
        'https://api.dev-directoai.com.br/account/api/v1/theme/account/acc_1',
      ),
    );
    expect(
      visitedUrls,
      contains(
        'https://api.dev-directoai.com.br/template/api/v1/templates/account/acc_1',
      ),
    );
  });
}
