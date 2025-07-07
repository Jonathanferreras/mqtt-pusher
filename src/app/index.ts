import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

import { fastifyServer } from '../lib/api/server';
import { mqttClient } from '../lib/mqtt/mqttClient';
import { pusherClient } from '../lib/pusher/pusherClient';
import { MqttEvent } from '../lib/mqtt/types/mqtt-event';

fastifyServer.start(
  (process.env.production ? process.env.FASTIFY_PROD_HOST : process.env.FASTIFY_DEV_HOST)!,
  parseInt(process.env.FASTIFY_PORT!)
);

mqttClient.start(process.env.MQTT_BROKER_URL!, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: `${process.env.MQTT_CLIENT_ID!}-${crypto.randomUUID()}`,
  clean: true,
  connectTimeout: 4000,
});

pusherClient.start({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
});

// pusherClient.trigger(process.env.PUSHER_CHANNEL!, 'server-connected', {
//   message: 'mqtt-pusher connected!',
// });

mqttClient.onConnect().then(() => {
  // mqttClient.publish(process.env.MQTT_PUB_TOPIC!, 'mqtt-pusher connected!');
  mqttClient.subscribe(process.env.MQTT_SUB_TOPIC!, (event: MqttEvent) => {
    pusherClient.trigger(process.env.PUSHER_CHANNEL!, 'mqtt-event', event);
  });
});
