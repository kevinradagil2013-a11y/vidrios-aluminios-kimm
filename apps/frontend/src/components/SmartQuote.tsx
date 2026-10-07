import { MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "../config/contact";
import { analyzeProject } from "../intelligence/project-intelligence";
import { buildProjectWhatsAppMessage } from "../intelligence/whatsapp-builder";

interface SmartQuoteProps {
  projectDescription: string;
}

export function SmartQuote({
  projectDescription,
}: SmartQuoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  const hasProject = projectDescription.trim().length > 0;
  const profile = analyzeProject(projectDescription);

  const message = hasProject
    ? buildProjectWhatsAppMessage(profile)
    : "Hola KIMM, quiero recibir asesoria para un proyecto de vidrios y aluminios.";

  return (
    <aside
      className={`smart-quote ${isOpen && !hasDismissed ? "is-open" : ""}`}
      aria-label="Asistente de cotizacion KIMM"
    >
      {isOpen && !hasDismissed && (
        <div className="smart-quote-panel">
          <button
            className="smart-quote-close"
            type="button"
            aria-label="Cerrar asistente"
            onClick={() => {
              setIsOpen(false);
              setHasDismissed(true);
            }}
          >
            <X size={16} />
          </button>

          <div className="smart-quote-badge">
            <Sparkles size={14} />
            KIMM SMART QUOTE
          </div>

          <h3>
            ¿Ya sabes
            <br />
            qué necesitas?
          </h3>

          <p className="smart-quote-description">
            Analizamos tu idea y preparamos una solicitud comercial
            personalizada.
          </p>

          {hasProject && (
            <div className="smart-quote-detected">
              <div>
                <span>PROYECTO DETECTADO</span>
                <strong>{profile.label}</strong>
              </div>

              <p>
                {profile.contextLabel}
                {profile.quantity !== null
                  ? ` · ${profile.quantity} unidades`
                  : ""}
                {profile.hasMeasurements ? " · Medidas detectadas" : ""}
              </p>
            </div>
          )}

          <a
            className="smart-quote-button"
            href={buildWhatsAppUrl(message)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            {hasProject ? "Cotizar mi proyecto" : "Hablar con KIMM"}
          </a>

          <small>Solicitud preparada para WhatsApp</small>
        </div>
      )}

      {!isOpen && !hasDismissed && (
        <button
          className="smart-quote-trigger"
          type="button"
          aria-label="Abrir Smart Quote"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles size={18} />
          <span>SMART QUOTE</span>
        </button>
      )}

      {hasDismissed && (
        <button
          className="smart-quote-reopen"
          type="button"
          aria-label="Volver a abrir Smart Quote"
          onClick={() => {
            setHasDismissed(false);
            setIsOpen(true);
          }}
        >
          <Sparkles size={18} />
        </button>
      )}
    </aside>
  );
}