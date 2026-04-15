import 'dart:convert';

import 'package:http/http.dart' as http;

import 'models/models.dart';

class DirectoAiRemoteBootstrapData {
  final CVDTheme theme;
  final List<DirectoAiTemplate> templates;

  const DirectoAiRemoteBootstrapData({
    required this.theme,
    required this.templates,
  });
}

class DirectoAiBootstrapService {
  DirectoAiBootstrapService({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  static final Map<String, Future<DirectoAiRemoteBootstrapData>>
  _bootstrapCache = <String, Future<DirectoAiRemoteBootstrapData>>{};

  static String _rootBaseUrl(DirectoAiConfig config) {
    final baseUrl = config.baseUrl ?? 'https://api.directoai.com.br';
    return baseUrl.replaceFirst(RegExp(r'/$'), '');
  }

  static String _templateBaseUrl(DirectoAiConfig config) {
    return (config.endpoints?.templateBaseUrl ??
            '${_rootBaseUrl(config)}/template')
        .replaceFirst(RegExp(r'/$'), '');
  }

  static String _accountBaseUrl(DirectoAiConfig config) {
    return (config.endpoints?.accountBaseUrl ??
            '${_rootBaseUrl(config)}/account')
        .replaceFirst(RegExp(r'/$'), '');
  }

  static String _cacheKey(DirectoAiConfig config) {
    return jsonEncode({
      'accountId': config.accountId,
      'templateBaseUrl': _templateBaseUrl(config),
      'accountBaseUrl': _accountBaseUrl(config),
    });
  }

  Future<List<DirectoAiTemplate>> fetchCvdTemplates(
    DirectoAiConfig config,
  ) async {
    final url =
        '${_templateBaseUrl(config)}/api/v1/templates/account/${Uri.encodeComponent(config.accountId)}';
    final response = await _client.get(Uri.parse(url));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to fetch templates: ${response.reasonPhrase}');
    }

    final json = jsonDecode(response.body);
    final data = (json is Map<String, dynamic> ? json['data'] : json) ?? json;

    return (data as List<dynamic>)
        .map(
          (item) => DirectoAiTemplate.fromJson(Map<String, dynamic>.from(item)),
        )
        .toList();
  }

  Future<CVDTheme> fetchCvdTheme(DirectoAiConfig config) async {
    final url =
        '${_accountBaseUrl(config)}/api/v1/theme/account/${Uri.encodeComponent(config.accountId)}';
    final response = await _client.get(Uri.parse(url));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to fetch theme: ${response.reasonPhrase}');
    }

    final json = jsonDecode(response.body);
    final data = (json is Map<String, dynamic> ? json['data'] : json) ?? json;
    return CVDTheme.fromJson(Map<String, dynamic>.from(data));
  }

  Future<DirectoAiRemoteBootstrapData> load(DirectoAiConfig config) {
    final key = _cacheKey(config);
    final cached = _bootstrapCache[key];
    if (cached != null) {
      return cached;
    }

    final request =
        Future.wait<dynamic>([fetchCvdTheme(config), fetchCvdTemplates(config)])
            .then((results) {
              return DirectoAiRemoteBootstrapData(
                theme: results[0] as CVDTheme,
                templates: results[1] as List<DirectoAiTemplate>,
              );
            })
            .catchError((Object error) {
              _bootstrapCache.remove(key);
              throw error;
            });

    _bootstrapCache[key] = request;
    return request;
  }

  static void clearCache([DirectoAiConfig? config]) {
    if (config == null) {
      _bootstrapCache.clear();
      return;
    }

    _bootstrapCache.remove(_cacheKey(config));
  }
}
