const axios = require("axios");

module.exports.config = {
  name: "ff",
  aliases: ["freefire"],
  version: "1.0",
  author: "Efat",
  role: 0,
  description: "Fetch Free Fire player details",
  category: "game",
  countDown: 3,
  guide: {
    en: `{pn} <player_id>\n\nExample:\n{pn} 2966880890`
  },
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("❌ Please provide a Free Fire Player ID!\nExample: -ff 2966880890", threadID, messageID);
  }

  const playerID = args[0];

  try {
    const res = await axios.get(`https://ff.lxonfire.workers.dev/?id=${encodeURIComponent(playerID)}`);

    if (!res.data || !res.data.nickname) {
      return api.sendMessage("❌ Player not found or API error!", threadID, messageID);
    }

    const { img_url, region, nickname } = res.data;
    const message = `🔥 Free Fire Player Details 🔥\n\n👤 Nickname: ${nickname}\n🌍 Region: ${region}\n🆔 Player ID: ${playerID}`;

    return api.sendMessage(
      { body: message, attachment: await global.utils.getStreamFromURL(img_url) },
      threadID,
      messageID
    );

  } catch (error) {
    console.error("Error fetching Free Fire data:", error);
    return api.sendMessage("❌ Failed to fetch Free Fire profile. Try again later!", threadID, messageID);
  }
};
