import 'package:flutter/foundation.dart';

class FeedVideoCoordinator {
  FeedVideoCoordinator._();

  static final ValueNotifier<String?> activeVideoId = ValueNotifier<String?>(
    null,
  );

  static void activate(String videoId) {
    if (activeVideoId.value == videoId) return;
    activeVideoId.value = videoId;
  }

  static void clear(String videoId) {
    if (activeVideoId.value == videoId) {
      activeVideoId.value = null;
    }
  }
}
