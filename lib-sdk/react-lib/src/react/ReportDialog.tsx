import React, { useMemo, useState } from "react";
import type { ComponentAction, ReportSubmission } from "../core/types.js";
import type { DirectoAiTracker } from "../core/tracker.js";

const REPORT_REASONS = [
  { id: "abuse_or_harassment", label: "Abuso ou assédio" },
  { id: "violence_or_hate", label: "Violência ou discurso de ódio" },
  { id: "spam_or_misleading", label: "Spam ou conteúdo enganoso" },
  { id: "false_information", label: "Informação falsa" },
  { id: "copyright_violation", label: "Violação de direitos autorais" },
  { id: "other_reason", label: "Outro motivo" },
] as const;

interface ReportDialogProps {
  action: ComponentAction;
  tracker: DirectoAiTracker;
  dataContext?: Record<string, unknown>;
  onClose: () => void;
  onSubmit?: (
    submission: ReportSubmission,
    dataContext?: Record<string, unknown>,
  ) => void | Promise<void>;
}

export function ReportDialog({
  action,
  tracker,
  dataContext,
  onClose,
  onSubmit,
}: ReportDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessState, setShowSuccessState] = useState(false);

  const selectedReason = useMemo(
    () => REPORT_REASONS.find((reason) => reason.id === selectedReasonId),
    [selectedReasonId],
  );
  const shouldShowDetails = selectedReasonId === "other_reason";
  const post =
    (dataContext?.post as Record<string, unknown> | undefined) || {};
  const postTitle =
    (post.title as string | undefined)?.trim() || "este conteúdo";
  const accountName =
    ((post.profile as Record<string, unknown> | undefined)?.accountName as
      | string
      | undefined)?.trim() || "a conta responsável";

  const handleSubmit = async () => {
    setErrorMessage("");
    setShowSuccessState(false);

    if (
      !selectedReason ||
      (selectedReason.id === "other_reason" && !details.trim())
    ) {
      setErrorMessage("Selecione um motivo válido para a denúncia.");
      return;
    }

    if (isSubmitting) return;

    const submission: ReportSubmission = {
      reasonId: selectedReason.id,
      reasonLabel: selectedReason.label,
      details: details.trim(),
      contentId:
        (post.contentId as string | undefined) ||
        (post.id as string | undefined),
      campaignId: post.campaignId as string | undefined,
      title: post.title as string | undefined,
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
      } else if (submission.contentId) {
        await tracker.reportContent(
          submission.contentId,
          submission.reasonId,
          submission.reasonId === "other_reason" ? submission.details : undefined,
        );

        window.dispatchEvent(
          new CustomEvent("directo:report-submit", {
            detail: {
              action,
              submission,
              dataContext: nextContext,
            },
          }),
        );
      } else {
        throw new Error("Missing contentId for report submission");
      }

      setShowSuccessState(true);
    } catch (error) {
      setErrorMessage(
        "Não foi possível enviar sua denúncia. Tente novamente mais tarde.",
      );
      console.error("Failed to submit report", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Denunciar anúncio"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(17, 24, 39, 0.48)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "358px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
          padding: "16px",
          boxSizing: "border-box",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {showSuccessState ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: "#101828",
                  }}
                >
                  Denúncia enviada com sucesso
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "0.74rem",
                    lineHeight: 1.45,
                    color: "#5f6673",
                  }}
                >
                  Recebemos sua denúncia sobre <strong>{postTitle}</strong>,
                  associado a <strong>{accountName}</strong>.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar modal"
                onClick={onClose}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#5f6673",
                  fontSize: "22px",
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: "0 0 0 8px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                marginTop: "12px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                padding: "12px",
                fontSize: "0.74rem",
                lineHeight: 1.5,
                color: "#475467",
              }}
            >
              Nossa equipe recebeu as informações enviadas e realizará uma
              análise criteriosa do post reportado, considerando o contexto do
              conteúdo e as políticas da plataforma. Caso sejam identificadas
              inconsistências ou violações, adotaremos as medidas cabíveis.
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "0.72rem",
                lineHeight: 1.45,
                color: "#11b780",
              }}
            >
              Agradecemos pela sua colaboração para manter a experiência mais
              segura, confiável e alinhada aos nossos padrões de qualidade.
            </div>
          </>
        ) : (
          <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.2rem",
                lineHeight: 1.15,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              Denunciar anúncio
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "0.84rem",
                lineHeight: 1.35,
                color: "#70757f",
              }}
            >
              Selecione o motivo da denúncia. Suas informações são
              confidenciais.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "#5f6673",
              fontSize: "22px",
              lineHeight: 1,
              cursor: "pointer",
              padding: "0 0 0 8px",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: "12px" }}>
          {REPORT_REASONS.map((reason) => {
            const isSelected = selectedReasonId === reason.id;
            return (
              <label
                key={reason.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 0",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "#f3f4f7" : "transparent",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    border: `2px solid ${isSelected ? "#10b981" : "#e5e7eb"}`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginRight: "12px",
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "9999px",
                        backgroundColor: "#10b981",
                        display: "block",
                      }}
                    />
                  )}
                </span>
                <input
                  type="radio"
                  name="directo-report-reason"
                  value={reason.id}
                  checked={isSelected}
                  onChange={() => setSelectedReasonId(reason.id)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.25,
                    color: "#101828",
                  }}
                >
                  {reason.label}
                </span>
              </label>
            );
          })}
        </div>

        {shouldShowDetails && (
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                marginBottom: "6px",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "#101828",
              }}
            >
              Informações adicionais
            </div>
            <textarea
              maxLength={200}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Descreva o motivo da denúncia..."
              style={{
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
              }}
            />
            <div
              style={{
                marginTop: "4px",
                textAlign: "right",
                fontSize: "0.68rem",
                color: "#667085",
              }}
            >
              {details.length}/200
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "0.72rem",
              color: "#dc2626",
            }}
          >
            {errorMessage}
          </div>
        )}

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              minHeight: "36px",
              borderRadius: "10px",
              border: "1px solid #CCC",
              backgroundColor: "#ffffff",
              color: "#111827",
              fontSize: ".78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            style={{
              flex: 1,
              minHeight: "36px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: selectedReason ? "#11b780" : "#d1d5db",
              color: "#ffffff",
              fontSize: ".78rem",
              fontWeight: 700,
              cursor: selectedReason ? "pointer" : "not-allowed",
            }}
          >
            {isSubmitting ? "Enviando..." : "Enviar denúncia"}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
