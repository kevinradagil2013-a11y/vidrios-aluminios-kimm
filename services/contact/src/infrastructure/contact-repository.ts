import { randomUUID } from "node:crypto";
import pg from "pg";
import type { ContactRequest } from "../domain/contact.js";
import type { CreateContactInput } from "../application/contact-schema.js";

const { Pool } = pg;

export class ContactRepository {
  private readonly pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/kimm",
    });
  }

  async create(input: CreateContactInput): Promise<ContactRequest> {
    const contact: ContactRequest = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      projectType: input.projectType,
      location: input.location || undefined,
      message: input.message,
      status: "NUEVA",
      createdAt: new Date(),
    };

    await this.pool.query(
      `
        INSERT INTO contacts (
          id,
          name,
          phone,
          project_type,
          location,
          message,
          status,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        contact.id,
        contact.name,
        contact.phone,
        contact.projectType,
        contact.location ?? null,
        contact.message,
        contact.status,
        contact.createdAt,
      ],
    );

    return contact;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}