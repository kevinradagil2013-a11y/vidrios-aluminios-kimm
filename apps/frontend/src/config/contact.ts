export const KIMM_WHATSAPP_NUMBER = "573011216921";

export const KIMM_WHATSAPP_URL =
  `https://wa.me/${KIMM_WHATSAPP_NUMBER}`;

export const KIMM_WHATSAPP_MESSAGES = {
  quote:
    "Hola KIMM 👋, quiero cotizar un proyecto de vidrios y aluminios. ¿Me pueden asesorar?",

  promotion:
    "Hola KIMM 👋, vi la promoción del 10% de descuento + reposa toallas de regalo y quiero cotizar.",

  advisor:
    "Hola KIMM 👋, quiero hablar con un asesor sobre mi proyecto.",
};

export function buildWhatsAppUrl(message: string) {
  return `${KIMM_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}