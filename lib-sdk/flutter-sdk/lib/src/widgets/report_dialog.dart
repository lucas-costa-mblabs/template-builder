import 'package:flutter/material.dart';

import '../action_handler.dart';
import '../models/models.dart';
import '../provider.dart';

class _ReportReasonOption {
  final String id;
  final String label;

  const _ReportReasonOption(this.id, this.label);
}

const List<_ReportReasonOption> _reportReasons = [
  _ReportReasonOption('abuse_or_harassment', 'Abuso ou assédio'),
  _ReportReasonOption('violence_or_hate', 'Violência ou discurso de ódio'),
  _ReportReasonOption('spam_or_misleading', 'Spam ou conteúdo enganoso'),
  _ReportReasonOption('false_information', 'Informação falsa'),
  _ReportReasonOption('copyright_violation', 'Violação de direitos autorais'),
  _ReportReasonOption('other_reason', 'Outro motivo'),
];

Future<void> showDirectoAiReportDialog(
  BuildContext context, {
  required ComponentAction action,
  Map<String, dynamic>? dataContext,
  ActionCallback? onAction,
  ReportSubmitCallback? onSubmit,
}) {
  return showDialog<void>(
    context: context,
    barrierDismissible: true,
    builder: (dialogContext) {
      return DirectoAiReportDialog(
        action: action,
        dataContext: dataContext,
        onAction: onAction,
        onSubmit: onSubmit,
      );
    },
  );
}

class DirectoAiReportDialog extends StatefulWidget {
  final ComponentAction action;
  final Map<String, dynamic>? dataContext;
  final ActionCallback? onAction;
  final ReportSubmitCallback? onSubmit;

  const DirectoAiReportDialog({
    super.key,
    required this.action,
    this.dataContext,
    this.onAction,
    this.onSubmit,
  });

  @override
  State<DirectoAiReportDialog> createState() => _DirectoAiReportDialogState();
}

class _DirectoAiReportDialogState extends State<DirectoAiReportDialog> {
  _ReportReasonOption? _selectedReason;
  final TextEditingController _detailsController = TextEditingController();
  bool _isSubmitting = false;
  String _errorMessage = '';
  bool _showSuccessState = false;

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    final sdk = DirectoAiTemplateProvider.of(context);
    final selectedReason = _selectedReason;

    setState(() {
      _errorMessage = '';
      _showSuccessState = false;
    });

    if (selectedReason == null ||
        (selectedReason.id == 'other_reason' &&
            _detailsController.text.trim().isEmpty)) {
      setState(() {
        _errorMessage = 'Selecione um motivo válido para a denúncia.';
      });
      return;
    }

    if (_isSubmitting) return;

    final postData = widget.dataContext?['post'] as Map<String, dynamic>?;
    final submission = ReportSubmission(
      reasonId: selectedReason.id,
      reasonLabel: selectedReason.label,
      details: _detailsController.text.trim(),
      contentId:
          postData?['contentId']?.toString() ?? postData?['id']?.toString(),
      campaignId: postData?['campaignId']?.toString(),
      title: postData?['title']?.toString(),
      createdAt: DateTime.now(),
    );

    final reportContext = {
      ...?widget.dataContext,
      'report': submission.toJson(),
    };

    setState(() => _isSubmitting = true);

    try {
      if (widget.onSubmit != null) {
        await widget.onSubmit!(submission, reportContext);
      } else if (submission.contentId != null && sdk != null) {
        await sdk.tracker.reportContent(
          submission.contentId!,
          reportType: submission.reasonId,
          description: submission.reasonId == 'other_reason'
              ? submission.details
              : null,
        );
      } else if (widget.onAction != null) {
        widget.onAction!(widget.action, reportContext);
      } else {
        throw Exception('Missing tracker or contentId for report submission');
      }

      if (!mounted) return;
      setState(() => _showSuccessState = true);
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _errorMessage =
            'Não foi possível enviar sua denúncia. Tente novamente mais tarde.';
      });
      debugPrint('Failed to submit report: $error');
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final counter = _detailsController.text.length;
    final shouldShowDetails = _selectedReason?.id == 'other_reason';
    final postData = widget.dataContext?['post'] as Map<String, dynamic>?;
    final postTitle = postData?['title']?.toString().trim().isNotEmpty == true
        ? postData!['title'].toString().trim()
        : 'este conteúdo';
    final accountName =
        (postData?['profile'] as Map<String, dynamic>?)?['accountName']
                ?.toString()
                .trim()
                .isNotEmpty ==
            true
        ? (postData?['profile'] as Map<String, dynamic>)['accountName']
              .toString()
              .trim()
        : 'a conta responsável';

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      backgroundColor: Colors.transparent,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 358),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: const [
            BoxShadow(
              color: Color(0x2E0F172A),
              blurRadius: 32,
              offset: Offset(0, 18),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
          child: _showSuccessState
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Denúncia enviada com sucesso',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF101218),
                                ),
                              ),
                              const SizedBox(height: 8),
                              RichText(
                                text: TextSpan(
                                  style: const TextStyle(
                                    fontSize: 12,
                                    height: 1.45,
                                    color: Color(0xFF5F6673),
                                  ),
                                  children: [
                                    const TextSpan(
                                      text: 'Recebemos sua denúncia sobre ',
                                    ),
                                    TextSpan(
                                      text: postTitle,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const TextSpan(text: ', associado a '),
                                    TextSpan(
                                      text: accountName,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const TextSpan(text: '.'),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          visualDensity: VisualDensity.compact,
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints.tightFor(
                            width: 24,
                            height: 24,
                          ),
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(Icons.close, size: 20),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Nossa equipe recebeu as informações enviadas e realizará uma análise criteriosa do post reportado, considerando o contexto do conteúdo e as políticas da plataforma. Caso sejam identificadas inconsistências ou violações, adotaremos as medidas cabíveis.',
                        style: TextStyle(
                          fontSize: 12,
                          height: 1.5,
                          color: Color(0xFF475467),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Agradecemos pela sua colaboração para manter a experiência mais segura, confiável e alinhada aos nossos padrões de qualidade.',
                      style: TextStyle(
                        fontSize: 11,
                        height: 1.45,
                        color: Color(0xFF11B780),
                      ),
                    ),
                  ],
                )
              : Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Denunciar anúncio',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF101218),
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                'Selecione o motivo da denúncia. Suas informações são confidenciais.',
                                style: TextStyle(
                                  fontSize: 12,
                                  height: 1.35,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          visualDensity: VisualDensity.compact,
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints.tightFor(
                            width: 24,
                            height: 24,
                          ),
                          onPressed: _isSubmitting
                              ? null
                              : () => Navigator.of(context).pop(),
                          icon: const Icon(Icons.close, size: 20),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ..._reportReasons.map((reason) {
                      final isSelected = _selectedReason?.id == reason.id;
                      return InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: _isSubmitting
                            ? null
                            : () => setState(() => _selectedReason = reason),
                        child: Container(
                          width: double.infinity,
                          padding: EdgeInsets.symmetric(
                            horizontal: 4,
                            vertical: isSelected ? 7 : 6,
                          ),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: isSelected
                                ? const Color(0xFFF3F4F7)
                                : Colors.transparent,
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Container(
                                width: 18,
                                height: 18,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isSelected
                                        ? const Color(0xFF10B981)
                                        : const Color(0xFFD1D5DB),
                                    width: 2,
                                  ),
                                ),
                                child: isSelected
                                    ? const Center(
                                        child: DecoratedBox(
                                          decoration: BoxDecoration(
                                            color: Color(0xFF10B981),
                                            shape: BoxShape.circle,
                                          ),
                                          child: SizedBox(width: 8, height: 8),
                                        ),
                                      )
                                    : null,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  reason.label,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: Color(0xFF101218),
                                    height: 1.2,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    if (shouldShowDetails) ...[
                      const SizedBox(height: 10),
                      const Text(
                        'Informações adicionais',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF101218),
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _detailsController,
                        enabled: !_isSubmitting,
                        maxLines: 3,
                        maxLength: 200,
                        onChanged: (_) => setState(() {}),
                        style: const TextStyle(fontSize: 12),
                        decoration: InputDecoration(
                          hintText: 'Descreva o motivo da denúncia...',
                          hintStyle: const TextStyle(fontSize: 12),
                          counterText: '',
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.all(12),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                              color: Color(0xFFD1D5DB),
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                              color: Color(0xFF0D63D6),
                            ),
                          ),
                        ),
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          '$counter/200',
                          style: const TextStyle(
                            fontSize: 10,
                            color: Color(0xFF667085),
                          ),
                        ),
                      ),
                    ],
                    if (_errorMessage.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Text(
                          _errorMessage,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xFFDC2626),
                          ),
                        ),
                      ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _isSubmitting
                                ? null
                                : () => Navigator.of(context).pop(),
                            style: OutlinedButton.styleFrom(
                              minimumSize: const Size.fromHeight(36),
                              side: const BorderSide(color: Color(0xFF10B981)),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                              ),
                            ),
                            child: const Text(
                              'Cancelar',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF101218),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: FilledButton(
                            onPressed: _selectedReason == null || _isSubmitting
                                ? null
                                : _handleSubmit,
                            style: FilledButton.styleFrom(
                              minimumSize: const Size.fromHeight(36),
                              backgroundColor: const Color(0xFF11B780),
                              disabledBackgroundColor: const Color(0xFFE5E7EB),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                              ),
                            ),
                            child: Text(
                              _isSubmitting ? 'Enviando...' : 'Enviar denúncia',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
