import 'dart:convert';

import 'package:directo_template_builder/directo_template_builder.dart';
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
    customerId: 'customer_1',
    baseUrl: 'https://api.dev-directoai.com.br',
  );

  tearDown(() {
    DirectoAiRemoteFeedService.clearCache();
  });

  test('remote feed service should fetch posts', () async {
    final visitedUrls = <String>[];
    final service = DirectoAiRemoteFeedService(
      client: FakeHttpClient((uri) async {
        visitedUrls.add(uri.toString());
        return http.Response(
          jsonEncode({
            'data': {
              'feeds': [
                {
                  'contentId': 'content_1',
                  'title': 'Post remoto',
                  'templateId': 'tpl_1',
                  'url': 'https://example.com/post.jpg',
                  'price': null,
                  'originalPrice': null,
                  'discount': null,
                },
              ],
            },
          }),
          200,
        );
      }),
    );

    final posts = await service.load(config);

    expect(posts.single.contentId, 'content_1');
    expect(posts.single.title, 'Post remoto');

    final uri = Uri.parse(visitedUrls.single);
    expect(uri.path, '/campaign/api/v2/feed');
    expect(uri.queryParameters['customer'], 'customer_1');
    expect(uri.queryParameters['accountId'], 'acc_1');
    expect(uri.queryParameters['apiKey'], 'api_key');
  });

  test('remote feed service should reuse cached request', () async {
    var requestCount = 0;
    final service = DirectoAiRemoteFeedService(
      client: FakeHttpClient((uri) async {
        requestCount += 1;
        return http.Response(
          jsonEncode({
            'data': {
              'feeds': [
                {
                  'contentId': 'content_1',
                  'title': 'Post remoto',
                  'templateId': 'tpl_1',
                  'url': 'https://example.com/post.jpg',
                  'price': null,
                  'originalPrice': null,
                  'discount': null,
                },
              ],
            },
          }),
          200,
        );
      }),
    );

    await Future.wait<List<Post>>([service.load(config), service.load(config)]);

    expect(requestCount, 1);
  });
}
