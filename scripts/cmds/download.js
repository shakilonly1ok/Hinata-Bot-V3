const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const supportedDomains = [
  "facebook.com", "fb.watch",
  "youtube.com", "youtu.be",
  "tiktok.com",
  "instagram.com", "instagr.am",
  "likee.com", "likee.video",
  "capcut.com",
  "spotify.com",
  "terabox.com",
  "twitter.com", "x.com",
  "drive.google.com",
  "soundcloud.com",
  "ndown.app",
  "pinterest.com", "pin.it"
];

const startUI = `
╭───────────────❍
│   🌐 𝑨𝑳𝑳 𝑴𝑬𝑫𝑰𝑨 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑬𝑹
╰───────────────❍

╭─❍
┊  🔗 Send any supported link
┊  ⚡ Auto download enabled
┊  🎬 Video / 🎵 Audio supported
╰───────────────❍
`;

const successUI = (platform, ext) => `
╭─❍
┊  🌐 Platform: ${platform}
┊  📦 Format  : ${ext}
╰───────────────❍
`;

module.exports = {
  config: {
    name: "download",
    version: "4.0",
    author: "Arafat",
    role: 0,
    shortDescription: "All-in-one media downloader",
    longDescription: "Automatically downloads videos or media from multiple supported platforms.",
    category: "utility",
    guide: { en: "Send any supported https:// link to auto-download." }
  },

  onStart: async function ({ api, event }) {
    api.sendMessage(startUI, event.threadID, event.messageID);
  },

  onChat: async function ({ api, event }) {

    const content = event.body ? event.body.trim() : "";
    if (!content.startsWith("https://")) return;
    if (!supportedDomains.some(domain => content.includes(domain))) return;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {

      const apiJson = await axios.get(
        "https://raw.githubusercontent.com/Arafat-Core/cmds/refs/heads/main/api.json"
      );

      const downloadBase = apiJson.data.download;

      const streamURL = content.includes("spotify.com")
        ? `${downloadBase}/spotify?url=${encodeURIComponent(content)}`
        : `${downloadBase}/arafatdl?url=${encodeURIComponent(content)}`;

      const extension =
        content.includes("spotify") || content.includes(".mp3")
          ? "mp3"
          : "mp4";

      const filePath = path.join(
        __dirname,
        "cache",
        `alldl_${Date.now()}.${extension}`
      );

      await fs.ensureDir(path.dirname(filePath));

      const stream = await axios({
        url: streamURL,
        method: "GET",
        responseType: "stream",
        timeout: 0
      });

      const writer = fs.createWriteStream(filePath);
      stream.data.pipe(writer);

      writer.on("finish", () => {

        const domain =
          supportedDomains.find(d => content.includes(d)) || "Unknown";

        const platformName =
          domain.replace(/(\.com|\.app|\.video|\.net)/, "").toUpperCase();

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        api.sendMessage(
          {
            body: successUI(platformName, extension.toUpperCase()),
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );

      });

      writer.on("error", () => {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      });

    } catch (err) {
      console.log("ALLDL ERROR:", err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
