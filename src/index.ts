import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prismaClient } from "./prismaa";

const hono = new Hono();

hono.get("/api/contacts", async (context) => {
  const contacts = await prismaClient.contact.findMany();
  return context.json({ contacts }, 200);
});

hono.post("/api/contacts", async (context) => {
  const { name, phone, email } = await context.req.json();
  const contact = await prismaClient.contact.create({
    data: { name, phone, email },
  });
  return context.json({ contact }, 201);
});

hono.patch("/api/contacts/:id", async (context) => {
  const { id } = context.req.param();
  const { name, phone, email } = await context.req.json();
  const contact = await prismaClient.contact.update({
    where: { id },
    data: { name, phone, email },
  });
  return context.json({ contact }, 200);
});

hono.delete("/api/contacts/:id", async (context) => {
  const { id } = context.req.param();
  const existingContact = await prismaClient.contact.findUnique({
    where: { id },
  });
  if (existingContact) {
    await prismaClient.contact.delete({ where: { id } });
    return context.json({ contact: existingContact }, 200);
  } else {
    return context.notFound();
  }
});

serve(hono, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
