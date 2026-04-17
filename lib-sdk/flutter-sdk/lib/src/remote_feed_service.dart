import 'dart:convert';

import 'package:http/http.dart' as http;

import 'models/models.dart';

class DirectoAiRemoteFeedService {
  DirectoAiRemoteFeedService({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  static final Map<String, Future<List<Post>>> _feedCache =
      <String, Future<List<Post>>>{};

  static String _rootBaseUrl(DirectoAiConfig config) {
    final baseUrl = config.baseUrl ?? 'https://api.directoai.com.br';
    return baseUrl.replaceFirst(RegExp(r'/$'), '');
  }

  static String _campaignBaseUrl(DirectoAiConfig config) {
    return (config.endpoints?.campaignBaseUrl ??
            '${_rootBaseUrl(config)}/campaign')
        .replaceFirst(RegExp(r'/$'), '');
  }

  static String _cacheKey(DirectoAiConfig config) {
    return jsonEncode({
      'accountId': config.accountId,
      'apiKey': config.apiKey,
      'customerId': config.customerId,
      'deviceId': config.deviceId,
      'campaignBaseUrl': _campaignBaseUrl(config),
    });
  }

  static void clearCache([DirectoAiConfig? config]) {
    if (config == null) {
      _feedCache.clear();
      return;
    }

    _feedCache.remove(_cacheKey(config));
  }

  Future<List<Post>> fetchRemoteFeed(DirectoAiConfig config) async {
    if (config.accountId.isEmpty ||
        config.apiKey.isEmpty ||
        (config.customerId?.isEmpty ?? true)) {
      throw Exception('Missing required data for remote feed request');
    }

    final url = Uri.parse('${_campaignBaseUrl(config)}/api/v2/feed').replace(
      queryParameters: <String, String>{
        'customer': config.customerId!,
        'accountId': config.accountId,
        'apiKey': config.apiKey,
        if (config.deviceId?.isNotEmpty ?? false) 'deviceId': config.deviceId!,
      },
    );

    print('DirectoAi SDK: Remote feed URL: $url');

    final response = await _client.get(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to fetch remote feed: ${response.statusCode}');
    }

    final payload = jsonDecode(response.body);
    final dynamic data = payload is Map<String, dynamic>
        ? payload['data']
        : payload;
    final dynamic feeds = data is Map<String, dynamic>
        ? data['feeds']
        : payload is Map<String, dynamic>
        ? payload['feeds'] ?? data
        : data;

    if (feeds is! List) {
      return <Post>[];
    }

    return feeds
        .whereType<Map>()
        .map((item) => Post.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<List<Post>> load(DirectoAiConfig config) {
    final key = _cacheKey(config);
    final cached = _feedCache[key];
    if (cached != null) {
      return cached;
    }

    final request = fetchRemoteFeed(config).catchError((Object error) {
      _feedCache.remove(key);
      throw error;
    });

    _feedCache[key] = request;
    return request;
  }
}
