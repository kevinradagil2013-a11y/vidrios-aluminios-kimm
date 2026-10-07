import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),

  phone: z
    .string()
    .trim()
    .min(7, "El teléfono no es válido")
    .max(30, "El teléfono es demasiado largo"),

  projectType: z
    .string()
    .trim()
    .min(2, "Selecciona el tipo de proyecto")
    .max(50),

  location: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(5, "Cuéntanos brevemente qué necesitas")
    .max(2000, "El mensaje es demasiado largo"),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;