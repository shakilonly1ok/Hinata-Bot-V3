const axios = require("axios");

module.exports = {
  config: {
      name: "anisearch",
          aliases: ["anime", "animesearch"],
              version: "1.0.2",
                  author: "Sahariya Islam Shakil",
                      countDown: 3,
                          role: 0,
                              shortDescription: "Search Anime info",
                                  longDescription: "Get detailed information for any Anime from Kitsu API.",
                                      category: "anime",
                                          guide: {
                                                en: "{p}anisearch [anime name]"
                                                    }
                                                      },
  onStart: async function ({ api, event, args }) {
      const query = args.join(" ");
    if (!query) {
          return api.sendMessage("🌸 Je anime-er info chao, tar naam lekho!\nExample: !anisearch Naruto", event.threadID, event.messageID);
              }
    try {
          // Using Kitsu API (No Cloudflare blockage / 429 rate limit issues)
                const res = await axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=1`);
      const animeList = res.data?.data;
      if (!animeList || animeList.length === 0) {
              return api.sendMessage(`❌ "${query}" naam-er kono anime khuje paowa jayni!`, event.threadID, event.messageID);
                    }
      const anime = animeList[0].attributes;
      const title = anime.canonicalTitle || anime.titles.en || anime.titles.en_jp;
            const japaneseTitle = anime.titles.ja_jp || "N/A";
                  const type = anime.showType || "N/A";
                        const episodes = anime.episodeCount || "Unknown";
                              const status = anime.status || "N/A";
                                    const score = anime.averageRating ? `⭐ ${anime.averageRating}/100` : "N/A";
                                          const startDate = anime.startDate || "N/A";
                                                const synopsis = anime.synopsis ? (anime.synopsis.length > 300 ? anime.synopsis.slice(0, 300) + "..." : anime.synopsis) : "No description available.";
                                                      const trailerUrl = anime.youtubeVideoId ? `https://www.youtube.com/watch?v=${anime.youtubeVideoId}` : "No trailer available";
                                                            const imageUrl = anime.posterImage?.original || anime.posterImage?.medium;
      const msgText = `✨ 𝐀𝐍𝐈𝐌𝐄 𝐈𝐍𝐅𝐎 ✨\n\n` +
              `🎬 𝐓itle: ${title}\n` +
                      `🇯🇵 𝐉apanese: ${japaneseTitle}\n` +
                              `📊 𝐒core: ${score}\n` +
                                      `🎥 𝐓ype: ${type} | 📺 𝐄pisodes: ${episodes}\n` +
                                              `📅 𝐑elease Date: ${startDate}\n` +
                                                      `📌 𝐒tatus: ${status}\n\n` +
                                                              `📝 𝐒ynopsis:\n${synopsis}\n\n` +
                                                                      `🍿 𝐓railer Video:\n${trailerUrl}`;
      if (imageUrl) {
              try {
                        const imageStream = (await axios.get(imageUrl, { responseType: "stream" })).data;
                                  return api.sendMessage({
                                              body: msgText,
                                                          attachment: imageStream
                                                                    }, event.threadID, event.messageID);
                                                                            } catch (imgErr) {
                                                                                      return api.sendMessage(msgText, event.threadID, event.messageID);
                                                                                              }
                                                                                                    } else {
                                                                                                            return api.sendMessage(msgText, event.threadID, event.messageID);
                                                                                                                  }
    } catch (error) {
          console.error("AniSearch Error:", error.message);
                return api.sendMessage(`❌ Request failed: ${error.message}`, event.threadID, event.messageID);
                    }
                      }
                      };
                      