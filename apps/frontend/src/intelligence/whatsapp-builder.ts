import type { ProjectProfile } from "./project-intelligence";

const contextText = {
  residential: "para vivienda",
  commercial: "para un proyecto comercial",
  architectural: "para un proyecto arquitectónico",
  unknown: "",
} as const;

export function buildProjectWhatsAppMessage(
  profile: ProjectProfile,
): string {
  const parts: string[] = [
    "Hola, equipo KIMM. 👋 Quiero recibir asesoría y cotizar mi proyecto.",
    `Estoy interesado en: ${profile.label}.`,
  ];

  if (profile.context !== "unknown") {
    parts.push(`Es ${contextText[profile.context]}.`);
  }

  if (profile.quantity !== null) {
    parts.push(`Cantidad aproximada: ${profile.quantity}.`);
  }

  if (profile.dimensions !== null) {
    parts.push(`Medidas aproximadas: ${profile.dimensions}.`);
  }

  if (profile.urgency !== "normal") {
    parts.push(`Tiempo requerido: ${profile.urgencyLabel.toLowerCase()}.`);
  }

  if (profile.asksPrice) {
    parts.push("Me gustaría conocer precios y disponibilidad.");
  } else {
    parts.push("Quisiera conocer opciones, acabados y precios.");
  }

  parts.push("¿Me pueden orientar con los siguientes pasos?");

  return parts.join(" ");
}

export function buildPromotionWhatsAppMessage(
  profile: ProjectProfile,
): string {
  const projectName =
    profile.intent === "general"
      ? "un proyecto de vidrios y aluminios"
      : profile.label.toLowerCase();

  const contextText =
    profile.context === "unknown"
      ? ""
      : ` para ${profile.contextLabel.toLowerCase()}`;

  const quantityText =
    profile.quantity === null
      ? ""
      : `, aproximadamente ${profile.quantity} unidades`;

  return (
    "Hola, equipo KIMM. 👋 Vi la promoción del 10% de descuento y el reposa toallas de regalo. " +
    `Quiero consultar si aplica para ${projectName}${contextText}${quantityText}. ` +
    "¿Me pueden explicar las condiciones y ayudarme a cotizar?"
  );
}
