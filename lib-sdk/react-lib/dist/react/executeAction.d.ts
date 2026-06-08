import type { ComponentAction } from "../core/types.js";
/**
 * Executor de ações padronizado para o contrato ComponentAction.
 * Para UI_ACTION e NAVIGATE, dispara CustomEvents para que o consumer
 * possa escutar e implementar o comportamento real.
 */
export declare function executeAction(action: ComponentAction | undefined, dataContext?: Record<string, unknown>): void;
//# sourceMappingURL=executeAction.d.ts.map