import Fastify, { FastifyInstance } from 'fastify';

const app: FastifyInstance = Fastify({ logger: true });

app.get('/', async () => {
  return { message: 'Hello from Fastify' };
});

async function start(host: string, port: number) {
  try {
    await app.listen({ port, host });
    console.log(`🚀 Fastify server running at ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

export const fastifyServer = {
  start,
};
