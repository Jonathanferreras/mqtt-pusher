import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { MqttEvent } from './types/mqtt-event';

let client: MqttClient;
let onConnect: Promise<void>;

function start(brokerUrl: string, options?: IClientOptions): MqttClient {
  if (!brokerUrl) throw new Error('MQTT broker URL is required');

  client = mqtt.connect(brokerUrl, options);

  onConnect = new Promise((resolve, reject) => {
    client.on('connect', () => {
      console.log('✅ MQTT connected');
      resolve();
    });

    client.on('message', (topic, message) => {
      console.log(`📨 ${topic}: ${message.toString()}`);
    });

    client.on('error', (error) => console.error('❌ MQTT Error:', error));
    client.on('close', () => console.log('🔌 MQTT Disconnected'));
    client.on('reconnect', () => console.log('♻️ MQTT Reconnecting'));
    client.on('offline', () => console.log('⚠️ MQTT Offline'));
    client.on('end', () => console.log('🛑 MQTT Ended'));
  });

  return client;
}

function publish(topic: string, message: string) {
  if (client?.connected) {
    client.publish(topic, message);
  } else {
    console.warn('⚠️ Cannot publish, MQTT client not connected');
  }
}

function subscribe(topic: string, handler: (message: MqttEvent) => void) {
  if (!client) {
    console.warn('MQTT client not initialized');
    return;
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`❌ Failed to subscribe to ${topic}`, err);
    } else {
      console.log(`📡 Subscribed to ${topic}`);
    }
  });

  client.on('message', (receivedTopic, buffer) => {
    if (receivedTopic === topic) {
      const event: MqttEvent = JSON.parse(buffer.toString());
      handler(event);
    }
  });
}

export const mqttClient = {
  start,
  publish,
  subscribe,
  onConnect: () => onConnect,
};
