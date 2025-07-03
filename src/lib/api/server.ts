import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { mqttClient } from '../mqtt/mqttClient';

const app: FastifyInstance = Fastify({ logger: true });

app.register(cors, {
  origin: '*',
});

app.get('/', async () => {
  return { message: 'Hello from Fastify' };
});

app.post('/publish', async (request, response) => {
  try {
    const { message } = request.body as {
      message: string;
    };

    if (!message) {
      return response.status(400).send({ error: 'Message is required!' });
    }

    mqttClient.publish(process.env.MQTT_PUB_TOPIC!, message);
    return response.send({ success: true });
  } catch (error) {
    request.log.error(error);
    return response.status(500).send({ error: 'Failed to publish to MQTT' });
  }
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
