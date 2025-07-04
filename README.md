# MQTT-PUSHER

---

This is a node application that serves as a bridge between [MQTT](https://mqtt.org/) and [PusherJS](https://pusher.com/). The main motive behind building this is to be able to receive (and transmit) realtime MQTT messages to and from Internet Of Things devices from a NextJS App. This can of course work with any frontend framework or on mobile.

## Getting Started

---

Rename the `.env.sample -> .env` and make sure to grab the neccessary config information for your mqtt broker and pusher and update the .env file.

Once that's done simply run `npm install && npm run dev`.

### What's Next

---

I will be adding docker config to the project and adding the ability to save events received to a database (at the moment thinking of supabase for convenience).
