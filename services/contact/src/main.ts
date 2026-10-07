import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { createContactSchema } from "./application/contact-schema.js";
import { CreateContact } from "./application/create-contact.js";
import { ContactRepository } from "./infrastructure/contact-repository.js";

const app = Fastify({
  logger: true,
});

const port = Number(process.env.PORT ?? 3107);
const host = process.env.HOST ?? "0.0.0.0";

await app.register(cors, {
  origin: true,
});

const repository = new ContactRepository();
const createContact = new CreateContact(repository);

app.get("/health", async () => {
  return {
    status: "ok",
    service: "kimm-contact-service",
  };
});

app.post("/contacts", async (request, reply) => {
  const result = createContactSchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "Datos de contacto inválidos",
      details: result.error.flatten(),
    });
  }

  try {
    const contact = await createContact.execute(result.data);

    return reply.status(201).send({
      success: true,
      contact: {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        projectType: contact.projectType,
        location: contact.location,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    app.log.error(error);

    return reply.status(500).send({
      error: "No fue posible registrar la solicitud de contacto",
    });
  }
});

const shutdown = async () => {
  await repository.close();
  await app.close();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

try {
  await app.listen({
    port,
    host,
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}