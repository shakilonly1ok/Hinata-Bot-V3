const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "info",
    version: "1.1.3",
    author: "Sahariya Islam Shakil",
    countDown: 5,
    role: 0,
    shortDescription: "Get bot and owner info with HD photo",
    longDescription: "Displays information about the bot owner with system statistics and HD photo.",
    category: "system",
    guide: {
      en: "{p}info"
    }
  },

  onStart: async function ({ api, event }) {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);

    const imageUrl = "https://i.imgur.com/I7D2n6K.jpeg";

    const message = `╭━━━[ 🤖 GOATBOT INFO ]━━━╮
│
├─ 👑 Owner: Sahariya Islam Shakil
├─ ⚙️ Prefix: /
├─ ⏱ Uptime: ${hours}h ${minutes}m ${seconds}s
├─ 📊 RAM Usage: ${usedMem} GB / ${totalMem} GB
├─ 🖥️ OS: ${os.type()} ${os.arch()}
├─ 🟢 Node.js: ${process.version}
│
╰━━━━━━━━━━━━━━━━━━━━╯`;

    try {
      const response = await axios.get(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        },
        responseType: "stream"
      });

      return api.sendMessage({
        body: message,
        attachment: response.data
      }, event.threadID, event.messageID);
    } catch (error) {
      return api.sendMessage(message, event.threadID, event.messageID);
    }
  }
};
