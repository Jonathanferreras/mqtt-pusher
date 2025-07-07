export type MqttEvent = {
  event_type: string;
  device_id: string;
  device_name: string;
  timestamp: string;
  payload_type: string;
  payload: any;
};
