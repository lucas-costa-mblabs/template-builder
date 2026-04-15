import 'package:directo_template_builder/src/models/models.dart';
import 'package:directo_template_builder/src/post.dart';
import 'package:directo_template_builder/src/provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final theme = CVDTheme(
    colors: {'gray-900': '#111827'},
    spacing: const {'md': '16px'},
    borderRadius: const {'md': '8px'},
    typography: const {},
  );

  Widget buildTestWidget(Widget child) {
    return MaterialApp(
      home: DirectoAiTemplateProvider(
        theme: theme,
        templates: const <DirectoAiTemplate>[],
        child: Scaffold(body: child),
      ),
    );
  }

  testWidgets('should render with explicit template override', (tester) async {
    final post = Post(
      contentId: 'content_1',
      title: 'Produto',
      url: 'https://example.com/image.png',
      price: '',
      originalPrice: '',
      discount: '',
      templateId: 'missing',
    );

    final template = DirectoAiTemplate(
      templateId: 'override',
      name: 'Override',
      active: true,
      slug: 'override',
      data: const [
        {'id': 'text-1', 'type': 'text', 'value': 'Override Template'},
      ],
    );

    await tester.pumpWidget(
      buildTestWidget(CVDPost(post: post, template: template)),
    );

    expect(find.text('Override Template'), findsOneWidget);
  });
}
