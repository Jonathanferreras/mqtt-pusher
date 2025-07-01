import { fastifyServer } from '../lib/api/server';
import { mqttClient } from '../lib/mqtt/mqttClient';
import { pusherClient } from '../lib/pusher/pusherClient';
import dotenv from 'dotenv';
dotenv.config();

fastifyServer.start(
  (process.env.production ? process.env.FASTIFY_PROD_HOST : process.env.FASTIFY_DEV_HOST)!,
  parseInt(process.env.FASTIFY_PORT!)
);

mqttClient.start(process.env.MQTT_BROKER_URL!, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: 'mqtt-pusher-' + Math.random().toString(16).substr(2, 8),
  clean: true,
  connectTimeout: 4000,
});

mqttClient.onConnect().then(() => {
  mqttClient.publish('server-connected', 'Hello from mqtt-pusher!');
  mqttClient.subscribe('fromHQ', () => {});
});

pusherClient.start({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
});

pusherClient.trigger('guppy', 'server-connected', {
  message: 'Hello from mqtt-pusher!',
});
