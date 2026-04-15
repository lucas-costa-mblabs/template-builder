import 'package:directo_template_builder/src/models/models.dart';
import 'package:directo_template_builder/src/provider.dart';
import 'package:directo_template_builder/src/tracker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final theme = CVDTheme(
    colors: {'primary': '#FF0000'},
    spacing: const {},
    borderRadius: const {},
    typography: const {},
  );

  testWidgets('should provide a noop tracker when config is omitted', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: DirectoAiTemplateProvider(
          theme: theme,
          templates: const <DirectoAiTemplate>[],
          child: Builder(
            builder: (context) {
              final provider = DirectoAiTemplateProvider.of(context)!;
              return Text(provider.tracker.runtimeType.toString());
            },
          ),
        ),
      ),
    );

    expect(find.text('NoopDirectoAiTracker'), findsOneWidget);
  });
}
