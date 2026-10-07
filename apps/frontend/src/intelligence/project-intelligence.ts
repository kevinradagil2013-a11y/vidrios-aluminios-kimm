export type ProjectIntent =
  | "bathroom"
  | "mirror"
  | "windows"
  | "divisions"
  | "aluminum"
  | "glass"
  | "general";

export type ProjectContext =
  | "residential"
  | "commercial"
  | "architectural"
  | "unknown";

export type ProjectUrgency =
  | "urgent"
  | "soon"
  | "normal";

export interface ProjectProfile {
  intent: ProjectIntent;
  label: string;
  context: ProjectContext;
  contextLabel: string;
  urgency: ProjectUrgency;
  urgencyLabel: string;
  quantity: number | null;
  dimensions: string | null;
  asksPrice: boolean;
  hasMeasurements: boolean;
  confidence: "high" | "medium" | "low";
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const containsAny = (text: string, values: string[]) =>
  values.some((value) => text.includes(value));

function detectIntent(text: string): ProjectIntent {
  if (containsAny(text, ["bano", "ducha", "cabina", "mampara"])) {
    return "bathroom";
  }

  if (containsAny(text, ["espejo", "espejos", "reflectivo"])) {
    return "mirror";
  }

  if (containsAny(text, ["ventana", "ventanas", "ventaneria"])) {
    return "windows";
  }

  if (
    containsAny(text, [
      "division",
      "divisiones",
      "separador",
      "cerramiento",
    ])
  ) {
    return "divisions";
  }

  if (
    containsAny(text, [
      "aluminio",
      "aluminios",
      "puerta",
      "puertas",
      "fachada",
    ])
  ) {
    return "aluminum";
  }

  if (
    containsAny(text, [
      "vidrio",
      "vidrios",
      "templado",
      "laminado",
      "cristal",
    ])
  ) {
    return "glass";
  }

  return "general";
}

function detectContext(text: string): ProjectContext {
  if (
    containsAny(text, [
      "apartamento",
      "apartamentos",
      "casa",
      "hogar",
      "habitacion",
      "bano",
      "cocina",
    ])
  ) {
    return "residential";
  }

  if (
    containsAny(text, [
      "oficina",
      "oficinas",
      "local",
      "comercial",
      "tienda",
      "restaurante",
      "hotel",
    ])
  ) {
    return "commercial";
  }

  if (
    containsAny(text, [
      "edificio",
      "fachada",
      "arquitectura",
      "proyecto",
      "obra",
      "constructora",
    ])
  ) {
    return "architectural";
  }

  return "unknown";
}

function detectUrgency(text: string): ProjectUrgency {
  if (
    containsAny(text, [
      "urgente",
      "urgencia",
      "inmediato",
      "inmediatamente",
      "ya",
    ])
  ) {
    return "urgent";
  }

  if (
    containsAny(text, [
      "esta semana",
      "esta quincena",
      "pronto",
      "proximamente",
    ])
  ) {
    return "soon";
  }

  return "normal";
}

function detectQuantity(text: string): number | null {
  const match = text.match(
    /\b(\d{1,3})\s*(?:ventanas?|puertas?|espejos?|divisiones?|cabinas?|vidrios?)\b/,
  );

  if (match) {
    return Number(match[1]);
  }

  return null;
}

function detectDimensions(text: string): string | null {
  const match = text.match(
    /\b\d+(?:[.,]\d+)?\s*(?:m|mts|metros|cm)\s*(?:x|por)\s*\d+(?:[.,]\d+)?\s*(?:m|mts|metros|cm)\b/i,
  );

  return match?.[0] ?? null;
}

function detectPriceIntent(text: string): boolean {
  return containsAny(text, [
    "precio",
    "precios",
    "cuanto",
    "cuanto cuesta",
    "costo",
    "cotizar",
    "cotizacion",
    "presupuesto",
    "valor",
  ]);
}

const labels: Record<ProjectIntent, string> = {
  bathroom: "Cabina o solucion para bano",
  mirror: "Espejo personalizado",
  windows: "Ventaneria en aluminio",
  divisions: "Division en vidrio",
  aluminum: "Solucion en aluminio",
  glass: "Solucion en vidrio",
  general: "Proyecto personalizado",
};

const contextLabels: Record<ProjectContext, string> = {
  residential: "Vivienda",
  commercial: "Comercial",
  architectural: "Arquitectonico",
  unknown: "Por definir",
};

const urgencyLabels: Record<ProjectUrgency, string> = {
  urgent: "Urgente",
  soon: "Proximo",
  normal: "Normal",
};

export function analyzeProject(description: string): ProjectProfile {
  const text = normalize(description);

  const intent = detectIntent(text);
  const context = detectContext(text);
  const urgency = detectUrgency(text);
  const quantity = detectQuantity(text);
  const dimensions = detectDimensions(text);
  const asksPrice = detectPriceIntent(text);

  const signals = [
    intent !== "general",
    context !== "unknown",
    quantity !== null,
    dimensions !== null,
    asksPrice,
  ].filter(Boolean).length;

  return {
    intent,
    label: labels[intent],
    context,
    contextLabel: contextLabels[context],
    urgency,
    urgencyLabel: urgencyLabels[urgency],
    quantity,
    dimensions,
    asksPrice,
    hasMeasurements: dimensions !== null,
    confidence: signals >= 3 ? "high" : signals >= 1 ? "medium" : "low",
  };
}