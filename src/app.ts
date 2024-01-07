import fastify from "fastify";

export const app = fastify({
  caseSensitive: true,
});

app.get("/", (request, reply) => {
  reply.status(200).send({ hello: "world" });
});

app.setErrorHandler((error, _, reply) => {
  return reply.status(500).send({ message: "Internal server error." });
});
