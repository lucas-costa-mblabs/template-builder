import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class LegacyHtmlView extends StatefulWidget {
  final String html;

  const LegacyHtmlView({super.key, required this.html});

  @override
  State<LegacyHtmlView> createState() => _LegacyHtmlViewState();
}

class _LegacyHtmlViewState extends State<LegacyHtmlView> {
  late final WebViewController _controller;
  double _contentHeight = 420;

  String _wrapHtmlDocument(String html) {
    final encodedHtml = html;
    return '''
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow-x: hidden;
      }

      body {
        display: inline-block;
        width: 100%;
      }
    </style>
  </head>
  <body>
    $encodedHtml
    <script>
      function notifyHeight() {
        const height = Math.max(
          document.documentElement.scrollHeight || 0,
          document.body.scrollHeight || 0,
          document.documentElement.offsetHeight || 0,
          document.body.offsetHeight || 0
        );
        HeightChannel.postMessage(String(height));
      }

      window.addEventListener('load', function() {
        setTimeout(notifyHeight, 100);
        setTimeout(notifyHeight, 350);
        setTimeout(notifyHeight, 800);
      });

      window.addEventListener('resize', notifyHeight);
    </script>
  </body>
</html>
''';
  }

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..enableZoom(false)
      ..addJavaScriptChannel(
        'HeightChannel',
        onMessageReceived: (message) {
          final nextHeight = double.tryParse(message.message);
          if (nextHeight == null || !mounted) return;
          if ((nextHeight - _contentHeight).abs() < 1) return;
          setState(() {
            _contentHeight = nextHeight.clamp(200, 2400);
          });
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) {
            _controller.runJavaScript('notifyHeight();');
          },
        ),
      )
      ..loadHtmlString(_wrapHtmlDocument(widget.html));
  }

  @override
  void didUpdateWidget(covariant LegacyHtmlView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.html != widget.html) {
      _controller.loadHtmlString(_wrapHtmlDocument(widget.html));
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: _contentHeight,
      child: WebViewWidget(controller: _controller),
    );
  }
}
