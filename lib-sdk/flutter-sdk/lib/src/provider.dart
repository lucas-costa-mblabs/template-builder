import 'package:flutter/material.dart';
import 'models/models.dart';
import 'action_handler.dart';
import 'tracker.dart';

class DirectoAiTemplateProvider extends InheritedWidget {
  final CVDTheme theme;
  final List<DirectoAiTemplate> templates;
  final DirectoAiConfig config;
  final DirectoAiTracker tracker;
  final ActionCallback? onAction;
  final ReportSubmitCallback? onReportSubmit;

  DirectoAiTemplateProvider({
    super.key,
    required this.theme,
    required this.templates,
    DirectoAiConfig? config,
    DirectoAiTracker? tracker,
    this.onAction,
    this.onReportSubmit,
    required Widget child,
  }) : config = config ?? DirectoAiConfig(accountId: '', apiKey: ''),
       tracker =
           tracker ??
           (config != null
               ? DefaultDirectoAiTracker(config)
               : NoopDirectoAiTracker()),
       super(child: child);

  static DirectoAiTemplateProvider? of(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<DirectoAiTemplateProvider>();
  }

  @override
  bool updateShouldNotify(covariant DirectoAiTemplateProvider oldWidget) {
    return theme != oldWidget.theme ||
        templates != oldWidget.templates ||
        config != oldWidget.config ||
        tracker != oldWidget.tracker ||
        onAction != oldWidget.onAction ||
        onReportSubmit != oldWidget.onReportSubmit;
  }
}
