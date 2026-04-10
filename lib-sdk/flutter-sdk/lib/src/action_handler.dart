import 'package:flutter/material.dart';
import 'models/models.dart';

/// Callback type para ações que o consumer precisa implementar.
typedef ActionCallback =
    void Function(ComponentAction action, Map<String, dynamic>? dataContext);

/// Executor de ações padronizado para Flutter.
/// Usa um callback fornecido pelo consumer para lidar com as ações.
void executeAction(
  ComponentAction? action,
  BuildContext context,
  Map<String, dynamic>? dataContext,
  ActionCallback? onAction,
) {
  if (action == null) return;

  if (onAction != null) {
    onAction(action, dataContext);
    return;
  }

  // Fallback: debug log (consumer não registrou callback)
  debugPrint(
    'DirectoAI: unhandled action type=${action.type} payload.actionName=${action.payload.actionName}',
  );
}

/// Extrai um ComponentAction opcional do map do nó.
ComponentAction? getNodeAction(
  Map<String, dynamic> node, [
  String key = 'action',
]) {
  return ComponentAction.fromOptionalJson(node[key]);
}
