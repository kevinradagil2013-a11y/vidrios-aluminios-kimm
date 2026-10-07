export const contactStatuses = [
  "NUEVA",
  "CONTACTADA",
  "COTIZADA",
  "CERRADA",
] as const;

export type ContactStatus = (typeof contactStatuses)[number];

export interface ContactRequest {
  id?: string;
  name: string;
  phone: string;
  projectType: string;
  location?: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}