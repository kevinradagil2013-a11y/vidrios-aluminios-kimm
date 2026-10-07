import type { CreateContactInput } from "./contact-schema.js";
import type { ContactRepository } from "../infrastructure/contact-repository.js";

export class CreateContact {
  constructor(private readonly repository: ContactRepository) {}

  async execute(input: CreateContactInput) {
    return this.repository.create(input);
  }
}