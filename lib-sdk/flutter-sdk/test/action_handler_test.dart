import 'package:directo_template_builder/directo_template_builder.dart';
import 'package:directo_template_builder/src/action_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final theme = CVDTheme(
    colors: {'primary': '#0D63D6'},
    spacing: {'xs': '4px', 'sm': '8px', 'md': '16px'},
    borderRadius: {'md': '8px'},
    typography: {},
  );

  Widget buildTestWidget({
    required Widget child,
    ReportSubmitCallback? onReportSubmit,
  }) {
    final config = DirectoAiConfig(accountId: 'test', apiKey: 'test');
    final tracker = DefaultDirectoAiTracker(config);

    return MaterialApp(
      home: DirectoAiTemplateProvider(
        config: config,
        tracker: tracker,
        theme: theme,
        templates: const <DirectoAiTemplate>[],
        onReportSubmit: onReportSubmit,
        child: Scaffold(body: child),
      ),
    );
  }

  testWidgets('should open report dialog and submit selected reason', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(1200, 1400));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    ReportSubmission? submission;

    final action = ComponentAction(
      type: 'UI_ACTION',
      payload: ActionPayload(actionName: 'report'),
    );

    await tester.pumpWidget(
      buildTestWidget(
        onReportSubmit: (report, dataContext) async {
          submission = report;
        },
        child: Builder(
          builder: (context) {
            return Center(
              child: ElevatedButton(
                onPressed: () {
                  executeAction(
                    action,
                    context,
                    {
                      'post': {
                        'contentId': 'content_1',
                        'campaignId': 'campaign_1',
                        'title': 'Raquete de Tênis',
                      },
                    },
                    null,
                    DirectoAiTemplateProvider.of(context)?.onReportSubmit,
                  );
                },
                child: const Text('Abrir denúncia'),
              ),
            );
          },
        ),
      ),
    );

    await tester.tap(find.text('Abrir denúncia'));
    await tester.pumpAndSettle();

    expect(find.text('Denunciar anúncio'), findsOneWidget);
    expect(find.text('Outro motivo'), findsOneWidget);

    await tester.tap(find.text('Outro motivo'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextField),
      'Esse anúncio parece incorreto.',
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(
      find.widgetWithText(FilledButton, 'Enviar denúncia'),
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Enviar denúncia'));
    await tester.pumpAndSettle();

    expect(submission, isNotNull);
    expect(submission!.reasonId, 'other_reason');
    expect(submission!.reasonLabel, 'Outro motivo');
    expect(submission!.details, 'Esse anúncio parece incorreto.');
    expect(submission!.contentId, 'content_1');
    expect(submission!.campaignId, 'campaign_1');

    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
  });
}
