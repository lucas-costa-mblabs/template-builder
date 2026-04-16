import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
const REPORT_REASONS = [
    { id: "abuse_or_harassment", label: "Abuso ou assédio" },
    { id: "violence_or_hate", label: "Violência ou discurso de ódio" },
    { id: "spam_or_misleading", label: "Spam ou conteúdo enganoso" },
    { id: "false_information", label: "Informação falsa" },
    { id: "copyright_violation", label: "Violação de direitos autorais" },
    { id: "other_reason", label: "Outro motivo" },
];
export function ReportDialog({ action, tracker, dataContext, onClose, onSubmit, }) {
    const [selectedReasonId, setSelectedReasonId] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessState, setShowSuccessState] = useState(false);
    const selectedReason = useMemo(() => REPORT_REASONS.find((reason) => reason.id === selectedReasonId), [selectedReasonId]);
    const shouldShowDetails = selectedReasonId === "other_reason";
    const post = dataContext?.post || {};
    const postTitle = post.title?.trim() || "este conteúdo";
    const accountName = post.profile?.accountName?.trim() || "a conta responsável";
    const handleSubmit = async () => {
        setErrorMessage("");
        setShowSuccessState(false);
        if (!selectedReason ||
            (selectedReason.id === "other_reason" && !details.trim())) {
            setErrorMessage("Selecione um motivo válido para a denúncia.");
            return;
        }
        if (isSubmitting)
            return;
        const submission = {
            reasonId: selectedReason.id,
            reasonLabel: selectedReason.label,
            details: details.trim(),
            contentId: post.contentId ||
                post.id,
            campaignId: post.campaignId,
            title: post.title,
            createdAt: new Date().toISOString(),
        };
        const nextContext = {
            ...dataContext,
            report: submission,
        };
        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(submission, nextContext);
            }
            else if (submission.contentId) {
                await tracker.reportContent(submission.contentId, submission.reasonId, submission.reasonId === "other_reason" ? submission.details : undefined);
                window.dispatchEvent(new CustomEvent("directo:report-submit", {
                    detail: {
                        action,
                        submission,
                        dataContext: nextContext,
                    },
                }));
            }
            else {
                throw new Error("Missing contentId for report submission");
            }
            setShowSuccessState(true);
        }
        catch (error) {
            setErrorMessage("Não foi possível enviar sua denúncia. Tente novamente mais tarde.");
            console.error("Failed to submit report", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { role: "dialog", "aria-modal": "true", "aria-label": "Denunciar an\u00FAncio", style: {
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(17, 24, 39, 0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
        }, onClick: onClose, children: _jsx("div", { style: {
                width: "100%",
                maxWidth: "358px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
                padding: "16px",
                boxSizing: "border-box",
            }, onClick: (event) => event.stopPropagation(), children: showSuccessState ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "12px",
                        }, children: [_jsxs("div", { children: [_jsx("h2", { style: {
                                            margin: 0,
                                            fontSize: "1.05rem",
                                            lineHeight: 1.2,
                                            fontWeight: 700,
                                            color: "#101828",
                                        }, children: "Den\u00FAncia enviada com sucesso" }), _jsxs("p", { style: {
                                            margin: "8px 0 0",
                                            fontSize: "0.74rem",
                                            lineHeight: 1.45,
                                            color: "#5f6673",
                                        }, children: ["Recebemos sua den\u00FAncia sobre ", _jsx("strong", { children: postTitle }), ", associado a ", _jsx("strong", { children: accountName }), "."] })] }), _jsx("button", { type: "button", "aria-label": "Fechar modal", onClick: onClose, style: {
                                    border: "none",
                                    background: "transparent",
                                    color: "#5f6673",
                                    fontSize: "22px",
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    padding: "0 0 0 8px",
                                }, children: "\u00D7" })] }), _jsx("div", { style: {
                            marginTop: "12px",
                            borderRadius: "12px",
                            backgroundColor: "#f8fafc",
                            padding: "12px",
                            fontSize: "0.74rem",
                            lineHeight: 1.5,
                            color: "#475467",
                        }, children: "Nossa equipe recebeu as informa\u00E7\u00F5es enviadas e realizar\u00E1 uma an\u00E1lise criteriosa do post reportado, considerando o contexto do conte\u00FAdo e as pol\u00EDticas da plataforma. Caso sejam identificadas inconsist\u00EAncias ou viola\u00E7\u00F5es, adotaremos as medidas cab\u00EDveis." }), _jsx("div", { style: {
                            marginTop: "10px",
                            fontSize: "0.72rem",
                            lineHeight: 1.45,
                            color: "#11b780",
                        }, children: "Agradecemos pela sua colabora\u00E7\u00E3o para manter a experi\u00EAncia mais segura, confi\u00E1vel e alinhada aos nossos padr\u00F5es de qualidade." })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "16px",
                        }, children: [_jsxs("div", { children: [_jsx("h2", { style: {
                                            margin: 0,
                                            fontSize: "1.2rem",
                                            lineHeight: 1.15,
                                            fontWeight: 700,
                                            color: "#101828",
                                        }, children: "Denunciar an\u00FAncio" }), _jsx("p", { style: {
                                            margin: "6px 0 0",
                                            fontSize: "0.84rem",
                                            lineHeight: 1.35,
                                            color: "#70757f",
                                        }, children: "Selecione o motivo da den\u00FAncia. Suas informa\u00E7\u00F5es s\u00E3o confidenciais." })] }), _jsx("button", { type: "button", "aria-label": "Fechar modal", onClick: onClose, style: {
                                    border: "none",
                                    background: "transparent",
                                    color: "#5f6673",
                                    fontSize: "22px",
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    padding: "0 0 0 8px",
                                }, children: "\u00D7" })] }), _jsx("div", { style: { marginTop: "12px" }, children: REPORT_REASONS.map((reason) => {
                            const isSelected = selectedReasonId === reason.id;
                            return (_jsxs("label", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "6px 0",
                                    borderRadius: "12px",
                                    backgroundColor: isSelected ? "#f3f4f7" : "transparent",
                                    cursor: "pointer",
                                }, children: [_jsx("span", { style: {
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "9999px",
                                            border: `2px solid ${isSelected ? "#10b981" : "#e5e7eb"}`,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginRight: "12px",
                                        }, children: isSelected && (_jsx("span", { style: {
                                                width: "8px",
                                                height: "8px",
                                                borderRadius: "9999px",
                                                backgroundColor: "#10b981",
                                                display: "block",
                                            } })) }), _jsx("input", { type: "radio", name: "directo-report-reason", value: reason.id, checked: isSelected, onChange: () => setSelectedReasonId(reason.id), style: { display: "none" } }), _jsx("span", { style: {
                                            fontSize: "0.95rem",
                                            lineHeight: 1.25,
                                            color: "#101828",
                                        }, children: reason.label })] }, reason.id));
                        }) }), shouldShowDetails && (_jsxs("div", { style: { marginTop: "12px" }, children: [_jsx("div", { style: {
                                    marginBottom: "6px",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    color: "#101828",
                                }, children: "Informa\u00E7\u00F5es adicionais" }), _jsx("textarea", { maxLength: 200, value: details, onChange: (event) => setDetails(event.target.value), placeholder: "Descreva o motivo da den\u00FAncia...", style: {
                                    width: "100%",
                                    minHeight: "76px",
                                    resize: "none",
                                    borderRadius: "10px",
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: "#ffffff",
                                    padding: "10px 12px",
                                    fontSize: "0.78rem",
                                    color: "#111827",
                                    outline: "none",
                                    boxSizing: "border-box",
                                } }), _jsxs("div", { style: {
                                    marginTop: "4px",
                                    textAlign: "right",
                                    fontSize: "0.68rem",
                                    color: "#667085",
                                }, children: [details.length, "/200"] })] })), errorMessage && (_jsx("div", { style: {
                            marginTop: "8px",
                            fontSize: "0.72rem",
                            color: "#dc2626",
                        }, children: errorMessage })), _jsxs("div", { style: {
                            marginTop: "12px",
                            display: "flex",
                            gap: "10px",
                        }, children: [_jsx("button", { type: "button", onClick: onClose, style: {
                                    flex: 1,
                                    minHeight: "36px",
                                    borderRadius: "10px",
                                    border: "1px solid #CCC",
                                    backgroundColor: "#ffffff",
                                    color: "#111827",
                                    fontSize: ".78rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }, children: "Cancelar" }), _jsx("button", { type: "button", onClick: handleSubmit, disabled: !selectedReason || isSubmitting, style: {
                                    flex: 1,
                                    minHeight: "36px",
                                    borderRadius: "10px",
                                    border: "none",
                                    backgroundColor: selectedReason ? "#11b780" : "#d1d5db",
                                    color: "#ffffff",
                                    fontSize: ".78rem",
                                    fontWeight: 700,
                                    cursor: selectedReason ? "pointer" : "not-allowed",
                                }, children: isSubmitting ? "Enviando..." : "Enviar denúncia" })] })] })) }) }));
}
//# sourceMappingURL=ReportDialog.js.map