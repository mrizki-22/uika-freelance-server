import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("================Bot whatsapp ready================");
});

client.on("send-message", async (data) => {
  const number = data.nowa;
  const text = data.message;
  const chatId = number.substring(1) + "@c.us";

  try {
    const res = await client.sendMessage(chatId, text);
    console.log(`Terkirim ke ${res._data?.to?.user}`);
  } catch (err) {
    console.log("gagal mengirim pesan");
  }
});

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.initialize();

export default client;
