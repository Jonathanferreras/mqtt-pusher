import Pusher from 'pusher';

let pusher: Pusher;

function start(config: {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
  useTLS?: boolean;
}) {
  pusher = new Pusher({
    appId: config.appId,
    key: config.key,
    secret: config.secret,
    cluster: config.cluster,
    useTLS: config.useTLS ?? true,
  });

  console.log('✅ Pusher client initialized');
}

function trigger(channel: string, event: string, data: any) {
  if (!pusher) {
    console.error('❌ Pusher not initialized. Call start() first.');
    return;
  }

  pusher.trigger(channel, event, data);
}

export const pusherClient = {
  start,
  trigger,
};
