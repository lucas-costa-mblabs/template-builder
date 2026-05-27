import React from "react";
import type { ComponentAction, ReportSubmission } from "../core/types.js";
import type { DirectoAiTracker } from "../core/tracker.js";
interface ReportDialogProps {
    action: ComponentAction;
    tracker: DirectoAiTracker;
    dataContext?: Record<string, unknown>;
    onClose: () => void;
    onSubmit?: (submission: ReportSubmission, dataContext?: Record<string, unknown>) => void | Promise<void>;
}
export declare function ReportDialog({ action, tracker, dataContext, onClose, onSubmit, }: ReportDialogProps): React.ReactPortal;
export {};
//# sourceMappingURL=ReportDialog.d.ts.map