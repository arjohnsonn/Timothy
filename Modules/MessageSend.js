const axios = require("axios");

const { EmbedBuilder } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const { TESTAPI_KEY, API_KEY, TESTUNIVERSE_ID, UNIVERSE_ID } = process.env;

function NewEmbed(Data) {
  const Embed = new EmbedBuilder()
    .setColor("#00ff00")
    .setDescription(
      `✅ Successfully set ${Data.Username}'s cash to ${Data.Amount}.\nTo prevent data loss, this may take a few seconds...`
    );
  return Embed;
}

module.exports.MessageSend = async function MessageSend(
  Message,
  Topic,
  interaction,
  Data,
  Type
) {
  const response = await axios
    .post(
      `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${Topic}`,
      {
        message: Message,
      },
      {
        headers: {
          "x-api-key": API_KEY,
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
    if (response.status == 200)
      if (Type === "setmoney") {
        return interaction.reply({ embeds: [NewEmbed(Data)] });
      }
    if (response.status != 200)
      return console.log(`**Error:** An unknown issue has occurred.`);
  }
};
