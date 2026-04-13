import type { ComponentAction } from "../core/types.js";
import { resolveVariables } from "./utils.js";

/**
 * Executor de ações padronizado para o contrato ComponentAction.
 * Para UI_ACTION e NAVIGATE, dispara CustomEvents para que o consumer
 * possa escutar e implementar o comportamento real.
 */
export function executeAction(
  action: ComponentAction | undefined,
  dataContext?: Record<string, unknown>,
) {
  if (!action) return;

  const { type, payload } = action;

  switch (type) {
    case "OPEN_URL": {
      const url = resolveVariables(payload.url, dataContext);
      if (url) window.open(url, "_blank");
      break;
    }
    case "DEEPLINK": {
      const deeplink = resolveVariables(
        payload.deeplink || payload.url,
        dataContext,
      );
      if (deeplink) window.open(deeplink, "_blank");
      break;
    }
    case "UI_ACTION": {
      window.dispatchEvent(
        new CustomEvent("directo:ui-action", {
          detail: { actionName: payload.actionName, dataContext, action },
        }),
      );
      break;
    }
    case "NAVIGATE": {
      window.dispatchEvent(
        new CustomEvent("directo:navigate", {
          detail: { target: payload.target, dataContext },
        }),
      );
      break;
    }
    default:
      console.warn("Ação não suportada:", type);
  }
}
