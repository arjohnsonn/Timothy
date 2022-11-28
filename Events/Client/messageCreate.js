const { EmbedBuilder } = require("discord.js");

const Admin = [
  933453103452282970, // BAP
  343875291665399818, // RAPID
  708395252028801144, // GOLDIE
  577174449585913880, // CHASE
  287805833692053513, // JOSH
  901953236578209792, // RED
  844735523552755724, // BILL
  695343735889854485, // JELLE,
  267775897099042828, // WOLF,
  642599595674959892, // CLASH
  337281567024218134, // PARA
  //1010879762664796190, // BOT ITSELF
];

const NoPing = ["343875291665399818"];
//const NoPing = [];

module.exports = {
  name: "messageCreate",
  execute(msg) {
    if (
      Admin.includes(Number(msg.author.id)) &&
      msg.author.id !== "343875291665399818"
    ) {
      msg.client.channels.cache
        .get("1016484969729773658")
        .send(
          "**" +
            msg.author.username +
            " in " +
            msg.channel.name +
            ":** " +
            msg.content
        );
    }

    try {
      if (
        !msg.member.roles.cache.has("796855972047618058") && // bot
        !msg.member.roles.cache.has("817669388337152060") && // Development
        !msg.member.roles.cache.has("1046503404769382532") && // Administration
        !msg.member.roles.cache.has("822489911331913748") && // CC
        !msg.member.roles.cache.has("1023742612676546560") // Guest Pass
      ) {
        const IdArray = Array.from(msg.mentions.members);
        let Detected = false;
        for (const [key, value] of Object.entries(IdArray)) {
          const Member = msg.guild.members.cache.find(
            (user) => user.id === value[0].toString()
          );
          if (Member) {
            if (Member.roles.cache.has("817669388337152060")) {
              if (!NoPing.includes(Member.id.toString())) {
                if (msg.content.includes(`<@${Member.id}>`)) {
                  Detected = true;

                  break;
                }
              }
            }
          }
        }
        if (Detected === true) {
          const Embed = new EmbedBuilder()
            .setTitle("❌ Do Not @ Developers")
            .setColor("#e0392d")
            .setDescription(
              "Do not ping developers, whether it is in a message or using the @ feature in replies."
            )
            .setImage("https://i.imgur.com/oCwYJBD.png");

          msg.client.channels.cache
            .get(msg.channel.id)
            .send({ content: "<@" + msg.author.id + ">", embeds: [Embed] });

          return;
        }
      }
    } catch {}
  },
};
