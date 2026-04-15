import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;
import 'package:uuid/uuid.dart';
import 'models/models.dart';

abstract class DirectoAiTracker {
  Future<void> trackEvent(String name, Map<String, dynamic> data);
  Future<void> trackImpression(String contentId, Map<String, dynamic> data);
  Future<void> trackViewTime(
    String contentId,
    int seconds,
    Map<String, dynamic> data,
  );
  Future<void> toggleLike(String contentId, {String? campaignId});
  Future<List<Post>> fetchProfileFeed(String profileAccountId);
  Future<void> followAccount(String profileAccountId);
  Future<void> unfollowAccount(String profileAccountId);
  Future<void> toggleFollowAccount(String profileAccountId, bool isFollowing);
  Future<void> addFavorite(String contentId, {String? campaignId});
  Future<void> removeFavorite(String contentId);
  Future<void> toggleFavorite(
    String contentId,
    bool isFavorited, {
    String? campaignId,
  });
  Future<void> shareContent(
    Map<String, dynamic> contentData, {
    String? campaignId,
    String? title,
  });
  Future<void> reportContent(
    String contentId, {
    required String reportType,
    String? description,
  });
}

class NoopDirectoAiTracker implements DirectoAiTracker {
  @override
  Future<void> addFavorite(String contentId, {String? campaignId}) async {}

  @override
  Future<List<Post>> fetchProfileFeed(String profileAccountId) async {
    return <Post>[];
  }

  @override
  Future<void> followAccount(String profileAccountId) async {}

  @override
  Future<void> removeFavorite(String contentId) async {}

  @override
  Future<void> reportContent(
    String contentId, {
    required String reportType,
    String? description,
  }) async {}

  @override
  Future<void> shareContent(
    Map<String, dynamic> contentData, {
    String? campaignId,
    String? title,
  }) async {}

  @override
  Future<void> toggleFavorite(
    String contentId,
    bool isFavorited, {
    String? campaignId,
  }) async {}

  @override
  Future<void> toggleFollowAccount(
    String profileAccountId,
    bool isFollowing,
  ) async {}

  @override
  Future<void> toggleLike(String contentId, {String? campaignId}) async {}

  @override
  Future<void> trackEvent(String name, Map<String, dynamic> data) async {}

  @override
  Future<void> trackImpression(
    String contentId,
    Map<String, dynamic> data,
  ) async {}

  @override
  Future<void> trackViewTime(
    String contentId,
    int seconds,
    Map<String, dynamic> data,
  ) async {}

  @override
  Future<void> unfollowAccount(String profileAccountId) async {}
}

class DefaultDirectoAiTracker implements DirectoAiTracker {
  final DirectoAiConfig config;
  final _uuid = const Uuid();

  DefaultDirectoAiTracker(this.config);

  String get baseUrl => config.baseUrl ?? "https://api.directoai.com.br";

  Uint8List _stringToUTF16LE(String value) {
    final bytes = Uint8List(value.length * 2);
    for (var i = 0; i < value.length; i++) {
      final code = value.codeUnitAt(i);
      bytes[i * 2] = code & 0xFF;
      bytes[i * 2 + 1] = code >> 8;
    }
    return bytes;
  }

  Future<String> _computeSHA256(String value) async {
    if (value.isEmpty) return '';

    final utf16Bytes = _stringToUTF16LE(value);
    return sha256.convert(utf16Bytes).toString().toUpperCase();
  }

  Future<void> _sendToAnalytics(
    String eventName,
    Map<String, dynamic> eventParams,
  ) async {
    if (config.onAnalyticsEvent != null) {
      try {
        config.onAnalyticsEvent!(eventName, eventParams);
      } catch (e) {
        print('DirectoAi SDK: Error in analytics callback: $e');
      }
    }
  }

  Future<void> _sendMessageQueue(Map<String, dynamic> payload) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/metric-queue'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );
      if (response.statusCode >= 400) {
        print(
          'DirectoAi SDK: Error sending message to queue: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('DirectoAi SDK: Failed to send analytic event: $e');
    }
  }

  @override
  Future<void> trackEvent(String name, Map<String, dynamic> data) async {
    final payload = {
      'type': 'click',
      'data': {
        ...data,
        'accountId': config.accountId,
        'customerId': config.customerId,
        'deviceId': config.deviceId,
        'eventType': name,
        'createdAt': DateTime.now().toUtc().toIso8601String(),
      },
    };
    return _sendMessageQueue(payload);
  }

  @override
  Future<void> trackImpression(
    String contentId,
    Map<String, dynamic> data,
  ) async {
    final payload = {
      'type': 'view',
      'data': {
        ...data,
        'contentId': contentId,
        'accountId': config.accountId,
        'customerId': config.customerId,
        'deviceId': config.deviceId,
        'createdAt': DateTime.now().toUtc().toIso8601String(),
      },
    };
    return _sendMessageQueue(payload);
  }

  @override
  Future<void> trackViewTime(
    String contentId,
    int seconds,
    Map<String, dynamic> data,
  ) async {
    final payload = {
      'type': 'timeView',
      'data': {
        ...data,
        'contentId': contentId,
        'time': seconds,
        'accountId': config.accountId,
        'customerId': config.customerId,
        'deviceId': config.deviceId,
        'createdAt': DateTime.now().toUtc().toIso8601String(),
      },
    };
    return _sendMessageQueue(payload);
  }

  @override
  Future<void> toggleLike(String contentId, {String? campaignId}) async {
    return trackEvent('click-like', {
      'contentId': contentId,
      if (campaignId != null) 'campaignId': campaignId,
    });
  }

  @override
  Future<List<Post>> fetchProfileFeed(String profileAccountId) async {
    if (config.accountId.isEmpty || config.apiKey.isEmpty) {
      throw Exception('Missing required data for profile feed request');
    }

    final url =
        '$baseUrl/campaign/api/v1/feed/accounts?accountId=${Uri.encodeQueryComponent(config.accountId)}&apiKey=${Uri.encodeQueryComponent(config.apiKey)}&profileAccountId=${Uri.encodeQueryComponent(profileAccountId)}';

    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode >= 300) {
        throw Exception(
          'Profile feed request failed with status: ${response.statusCode}',
        );
      }

      final payload = jsonDecode(response.body);
      final dynamic data = payload['data'];
      final dynamic feeds = data is Map<String, dynamic>
          ? data['feeds']
          : payload['feeds'] ?? data;

      if (feeds is! List) {
        return <Post>[];
      }

      return feeds
          .whereType<Map>()
          .map((item) => Post.fromJson(Map<String, dynamic>.from(item)))
          .toList();
    } catch (e) {
      print('DirectoAi SDK: Failed to fetch profile feed: $e');
      rethrow;
    }
  }

  @override
  Future<void> followAccount(String profileAccountId) async {
    if (config.accountId.isEmpty ||
        config.apiKey.isEmpty ||
        (config.customerId?.isEmpty ?? true)) {
      throw Exception('Missing required data for follow action');
    }

    final url =
        '$baseUrl/campaign/api/v1/feed/followers?accountId=${Uri.encodeQueryComponent(config.accountId)}&apiKey=${Uri.encodeQueryComponent(config.apiKey)}';

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accountId': profileAccountId,
          'customerId': config.customerId,
        }),
      );

      if (response.statusCode >= 300) {
        throw Exception(
          'Follow account failed with status: ${response.statusCode}',
        );
      }

      await trackEvent('click-follow', {'profileAccountId': profileAccountId});
    } catch (e) {
      print('DirectoAi SDK: Failed to follow account: $e');
      rethrow;
    }
  }

  @override
  Future<void> unfollowAccount(String profileAccountId) async {
    if (config.accountId.isEmpty ||
        config.apiKey.isEmpty ||
        (config.customerId?.isEmpty ?? true)) {
      throw Exception('Missing required data for unfollow action');
    }

    final url =
        '$baseUrl/campaign/api/v1/feed/followers?accountId=${Uri.encodeQueryComponent(config.accountId)}&apiKey=${Uri.encodeQueryComponent(config.apiKey)}';

    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accountId': profileAccountId,
          'customerId': config.customerId,
        }),
      );

      if (response.statusCode >= 300) {
        throw Exception(
          'Unfollow account failed with status: ${response.statusCode}',
        );
      }

      await trackEvent('click-unfollow', {
        'profileAccountId': profileAccountId,
      });
    } catch (e) {
      print('DirectoAi SDK: Failed to unfollow account: $e');
      rethrow;
    }
  }

  @override
  Future<void> toggleFollowAccount(
    String profileAccountId,
    bool isFollowing,
  ) async {
    if (isFollowing) {
      return unfollowAccount(profileAccountId);
    }

    return followAccount(profileAccountId);
  }

  @override
  Future<void> addFavorite(String contentId, {String? campaignId}) async {
    final url = '$baseUrl/campaign/api/v1/feed/favorites';

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accountId': config.accountId,
          'customerId': config.customerId,
          'contentId': contentId,
          if (campaignId != null) 'campaignId': campaignId,
        }),
      );

      // Log metrics on success or conflict (already favorited)
      if (response.statusCode < 300 || response.statusCode == 409) {
        await trackEvent('click-favorite', {
          'contentId': contentId,
          if (campaignId != null) 'campaignId': campaignId,
        });

        await _sendToAnalytics('click_card', {
          'content_id': contentId,
          'account_id': config.accountId,
          'customer_id': config.customerId,
          'event_type': 'click-favorite',
        });
      }

      if (response.statusCode >= 300 && response.statusCode != 409) {
        throw Exception(
          'Add favorite failed with status: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('DirectoAi SDK: Error adding favorite: $e');
      rethrow;
    }
  }

  @override
  Future<void> removeFavorite(String contentId) async {
    final url = '$baseUrl/campaign/api/v1/feed/favorites';

    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accountId': config.accountId,
          'customerId': config.customerId,
          'contentId': contentId,
        }),
      );

      if (response.statusCode >= 300) {
        throw Exception(
          'Remove favorite failed with status: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('DirectoAi SDK: Error removing favorite: $e');
      rethrow;
    }
  }

  @override
  Future<void> toggleFavorite(
    String contentId,
    bool isFavorited, {
    String? campaignId,
  }) async {
    if (isFavorited) {
      return removeFavorite(contentId);
    } else {
      return addFavorite(contentId, campaignId: campaignId);
    }
  }

  @override
  Future<void> shareContent(
    Map<String, dynamic> contentData, {
    String? campaignId,
    String? title,
  }) async {
    final shareId = _uuid.v4();
    final contentId =
        contentData['contentId']?.toString() ??
        contentData['id']?.toString() ??
        '';

    String? base64Template;
    if (contentData['template'] != null && contentData['template'] is String) {
      try {
        final bytes = utf8.encode(contentData['template']);
        base64Template = base64Encode(bytes);
      } catch (_) {}
    }

    try {
      final payload = {
        'shareId': shareId,
        'contentId': contentId,
        'campaignId': campaignId ?? '',
        'accountId': config.accountId,
        'createdBy': config.customerId ?? '',
        'expiresInHours': 168,
        'content': {
          ...contentData,
          'encryptedSnapshot': base64Template,
          'template': null,
        },
      };

      print('DirectoAi SDK: Creating share link...');
      print('URL: $baseUrl/campaign/api/v1/feed/share');
      // print('Payload: ${jsonEncode(payload)}'); // Omit for brevity in logs unless needed

      final response = await http.post(
        Uri.parse('$baseUrl/campaign/api/v1/feed/share'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );

      if (response.statusCode < 300) {
        final result = jsonDecode(response.body);
        final publicShareUrl = result['data']?['url']?.toString();

        if (publicShareUrl == null) {
          throw Exception('Share API failed: No URL returned');
        }

        print('DirectoAi SDK: Share created successfully: $publicShareUrl');

        await trackEvent('click-share', {
          'contentId': contentId,
          if (campaignId != null) 'campaignId': campaignId,
        });
      } else {
        throw Exception(
          'Share API failed with status: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      print('DirectoAi SDK: Error creating share link: $e');
    }
  }

  @override
  Future<void> reportContent(
    String contentId, {
    required String reportType,
    String? description,
  }) async {
    final url = '$baseUrl/content/api/v1/contents/$contentId/report';
    final reporterCustomerId = await _computeSHA256(config.customerId ?? '');

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'reportType': reportType,
          'reporterCustomerId': reporterCustomerId,
          if (description != null && description.isNotEmpty)
            'description': description,
        }),
      );

      if (response.statusCode >= 300) {
        throw Exception(
          'Report content failed with status: ${response.statusCode}',
        );
      }

      await trackEvent('click-report', {
        'contentId': contentId,
        'reportType': reportType,
      });
    } catch (e) {
      print('DirectoAi SDK: Error reporting content: $e');
      rethrow;
    }
  }
}
