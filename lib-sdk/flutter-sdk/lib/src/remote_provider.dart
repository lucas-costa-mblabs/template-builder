import 'package:flutter/material.dart';

import 'action_handler.dart';
import 'bootstrap_service.dart';
import 'models/models.dart';
import 'provider.dart';
import 'tracker.dart';

typedef RemoteProviderLoadingBuilder = Widget Function(BuildContext context);
typedef RemoteProviderErrorBuilder =
    Widget Function(BuildContext context, Object error, VoidCallback retry);

class DirectoAiRemoteTemplateProvider extends StatefulWidget {
  final DirectoAiConfig config;
  final DirectoAiTracker? tracker;
  final ActionCallback? onAction;
  final ReportSubmitCallback? onReportSubmit;
  final Widget child;
  final CVDTheme? initialTheme;
  final List<DirectoAiTemplate>? initialTemplates;
  final RemoteProviderLoadingBuilder? loadingBuilder;
  final RemoteProviderErrorBuilder? errorBuilder;
  final DirectoAiBootstrapService? bootstrapService;

  const DirectoAiRemoteTemplateProvider({
    super.key,
    required this.config,
    this.tracker,
    this.onAction,
    this.onReportSubmit,
    required this.child,
    this.initialTheme,
    this.initialTemplates,
    this.loadingBuilder,
    this.errorBuilder,
    this.bootstrapService,
  });

  @override
  State<DirectoAiRemoteTemplateProvider> createState() =>
      _DirectoAiRemoteTemplateProviderState();
}

class _DirectoAiRemoteTemplateProviderState
    extends State<DirectoAiRemoteTemplateProvider> {
  CVDTheme? _theme;
  List<DirectoAiTemplate>? _templates;
  Object? _error;
  late final DirectoAiBootstrapService _bootstrapService;

  @override
  void initState() {
    super.initState();
    _bootstrapService = widget.bootstrapService ?? DirectoAiBootstrapService();
    _theme = widget.initialTheme;
    _templates = widget.initialTemplates;

    if (_theme == null || _templates == null) {
      _load();
    }
  }

  @override
  void didUpdateWidget(covariant DirectoAiRemoteTemplateProvider oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.config != widget.config) {
      _theme = widget.initialTheme;
      _templates = widget.initialTemplates;
      _error = null;

      if (_theme == null || _templates == null) {
        _load();
      }
    }
  }

  Future<void> _load() async {
    if (mounted) {
      setState(() {
        _error = null;
      });
    }

    try {
      final bootstrapData = await _bootstrapService.load(widget.config);
      if (!mounted) return;

      setState(() {
        _theme = bootstrapData.theme;
        _templates = bootstrapData.templates;
        _error = null;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _error = error;
        _theme = null;
        _templates = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      if (widget.errorBuilder != null) {
        return widget.errorBuilder!(context, _error!, _load);
      }
      return const SizedBox.shrink();
    }

    if (_theme == null || _templates == null) {
      if (widget.loadingBuilder != null) {
        return widget.loadingBuilder!(context);
      }
      return const SizedBox.shrink();
    }

    return DirectoAiTemplateProvider(
      theme: _theme!,
      templates: _templates!,
      config: widget.config,
      tracker: widget.tracker ?? DefaultDirectoAiTracker(widget.config),
      onAction: widget.onAction,
      onReportSubmit: widget.onReportSubmit,
      child: widget.child,
    );
  }
}
