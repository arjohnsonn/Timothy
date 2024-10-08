const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const {
  TESTAPI_KEY,
  API_KEY,
  TESTUNIVERSE_ID,
  UNIVERSE_ID,
  QAAPI_KEY,
  QAUNIVERSE_ID,
} = process.env;

var KEY = API_KEY;
var UNIVERSE = UNIVERSE_ID;

module.exports.MessageSend = async function MessageSend(Message, Topic) {
  const response = await axios
    .post(
      `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE}/topics/${Topic}`,
      {
        message: JSON.stringify(Message),
      },
      {
        headers: {
          "x-api-key": KEY,
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => {
      console.log(err.response.status);
      if (err.response.status == 401)
        return console.log(
          `**Error:** API key not valid for operation, user does not have authorization`
        );
      if (err.response.status == 403)
        return console.log(`**Error:** Publish is not allowed on universe.`);
      if (err.response.status == 500)
        return console.log(`**Error:** Server internal error / Unknown error.`);
      if (err.response.status == 400) {
        if (
          err.response.data ==
          "requestMessage cannot be longer than 1024 characters. (Parameter 'requestMessage')"
        )
          return console.log(
            `**Error:** The request message cannot be longer then 1024 characters long.`
          );
        console.log(err.response.data);
      }
    });
  if (response) {
    if (response.status == 200) {
      console.log(`Successfully sent ${Topic} to ${Message}, UID: ${UNIVERSE}`);
      return true;
    }
    /*
    if (Type === "setmoney") {
      const Embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Money")
        .setDescription(
          `✅ Successfully set ${Data.Username}'s cash to ${Data.Amount}.\nTo prevent data loss, this may take a few seconds...`
        )
        .addFields();
      return interaction.reply({
        embeds: [Embed],
      });
    } else if (Type === "Global Announcement") {
    }*/
    if (response.status != 200)
      return console.log(`**Error:** An unknown issue has occurred.`);
  }
};

module.exports.Refresh = function Refresh(Integer) {
  if (Integer == 1) {
    KEY = API_KEY;
    UNIVERSE = UNIVERSE_ID;
  } else if (Integer == 2) {
    KEY = QAAPI_KEY;
    UNIVERSE = QAUNIVERSE_ID;
  } else {
    KEY = TESTAPI_KEY;
    UNIVERSE = TESTUNIVERSE_ID;
  }
};
