import 'package:directo_template_builder/src/media_utils.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('inferMediaType should support explicit type and file extension', () {
    expect(
      inferMediaType('https://example.com/image.jpg', explicitType: 'video'),
      'video',
    );
    expect(inferMediaType('https://example.com/video.mp4'), 'video');
    expect(
      inferMediaType('https://example.com/live/index.m3u8?token=123'),
      'video',
    );
    expect(inferMediaType('https://example.com/image.jpg'), 'image');
  });

  test('isHlsUrl should identify playlists', () {
    expect(isHlsUrl('https://example.com/live/index.m3u8#fragment'), true);
    expect(isHlsUrl('https://example.com/video.mp4'), false);
  });

  test('parseAspectRatio should parse ratio strings', () {
    expect(parseAspectRatio('16/9'), closeTo(16 / 9, 0.0001));
    expect(parseAspectRatio('1.5'), 1.5);
    expect(parseAspectRatio('invalid'), isNull);
  });
}
