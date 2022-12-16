const { EmbedBuilder, ThreadAutoArchiveDuration } = require("discord.js");
const Database = require("../../Schemas/Points");
const ms = require("ms");

const Admin = [
  933453103452282970, // BAP
  708395252028801144, // GOLDIE
  287805833692053513, // JOSH
  901953236578209792, // RED
  //1010879762664796190, // BOT ITSELF
];

const StaffRoleIds = [];

const NoPing = ["343875291665399818"];
//const NoPing = [];

module.exports = {
  name: "messageCreate",
  async execute(msg) {
    if (!msg.guild) return;

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

    if (msg.channelId === "1050841814631993427") {
      if (msg.webhookId && msg.content !== "") {
        const thread = await msg.startThread({
          name: msg.content,
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          reason: "AUTOMATION: Attached thread to game ban appeal",
        });

        await thread.members.add("1010879762664796190");
      }
    }

    try {
      if (
        msg.author.id === "470722416427925514" ||
        msg.author.id === "155149108183695360"
      ) {
        // 155149108183695360
        const Embed = msg.embeds;
        if (Embed === null || Embed.length === 0) return;

        let Member;
        const EmbedDesc = Embed[0].description;
        if (EmbedDesc === null || EmbedDesc.length === 0) return;

        let FullUser;
        let Username;
        let Discriminator;
        let AddPoints = 0;
        if (EmbedDesc.includes("couldn't")) {
          FullUser = EmbedDesc.split(". ")[0].slice(56);
          Username = FullUser.slice(0, -5);
          Discriminator = FullUser.split("#")[1];
          AddPoints = 1;
        } else if (EmbedDesc.includes("has been warned")) {
          FullUser = EmbedDesc.split(". ")[0].slice(37, -20);
          Username = FullUser.slice(0, -5);
          Discriminator = FullUser.split("#")[1];
          AddPoints = 1;
        } else if (EmbedDesc.includes("was muted")) {
          FullUser = EmbedDesc.split(". ")[0].slice(37, -13);
          Username = FullUser.slice(0, -5);
          Discriminator = FullUser.split("#")[1];
          AddPoints = 2;
        }

        if (!Username) return;
        if (!FullUser) return;
        if (!Discriminator) return;

        EligibleMembers = await msg.guild.members.search({
          query: Username,
        });

        for (const [key, guildMember] of Array.from(EligibleMembers)) {
          if (guildMember.user.discriminator === Discriminator) {
            Member = msg.guild.members.cache.get(guildMember.user.id);
            break;
          }
        }

        if (Member) {
          if (
            Member.roles.cache.has("1046499539764396113") ||
            Member.roles.cache.has("837979573522137091")
          ) {
            const Embed = new EmbedBuilder()
              .setColor("#e0392d")
              .setDescription(
                "❌ Unable to add points to user as they are a HR member"
              );

            msg.channel.send({ embeds: [Embed] });
            return;
          }

          let userData = await Database.findOne({
            Guild: msg.guild.id,
            User: Member.id,
          });
          if (!userData) {
            userData = await Database.create({
              Guild: msg.guild.id,
              User: Member.id,
              Points: 0,
            });
          }

          const CurrentPoints = userData.Points;
          userData.Points = CurrentPoints + AddPoints;

          await userData.save();

          let addition = "";
          if (userData.Points > 1) {
            addition = "s";
          }
          msg.channel.send(
            `*<:TimothyThink:881905210065293363>* *${Member.user.username}* has **${userData.Points}** point${addition}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
    /*else {
      const Args = msg.content.split(" ");
      if (Args[0] == "!kick") {
        const Reason = Args.slice(2).join(" ") + " ";
        const Name = msg.content.slice(6, -Reason.length);

        let Member;

        EligibleMembers = await msg.guild.members.search({
          query: Name,
        });

        for (const [key, guildMember] of Array.from(EligibleMembers)) {
          if (guildMember.user.nickname === Name) {
            Member = msg.guild.members.cache.get(guildMember.user.id);
            break;
          }
        }

        if (Member) {
          if (
            Member.roles.cache.has("1046499539764396113") ||
            Member.roles.cache.has("837979573522137091")
          ) {
            const Embed = new EmbedBuilder()
              .setColor("#e0392d")
              .setDescription(
                "❌ Unable to add points to user as they are a higher position"
              );

            msg.channel.send({ embeds: [Embed] });
            return;
          }

          let userData = await Database.findOne({
            Guild: msg.guild.id,
            User: Member.id,
          });
          if (!userData) {
            userData = await Database.create({
              Guild: msg.guild.id,
              User: Member.id,
              Points: 0,
            });
          }

          const CurrentPoints = userData.Points;
          userData.Points = CurrentPoints + AddPoints;

          await userData.save();

          msg.channel.send(
            `*<:TimothyThink:881905210065293363>* *${Member.user.username}* has **${userData.Points}** points`
          );
        }
      }
    }*/

    try {
      if (
        !msg.member.roles.cache.has("796855972047618058") && // bot
        !msg.member.roles.cache.has("837979573522137091") && // BoD
        !msg.member.roles.cache.has("817669388337152060") && // Development
        !msg.member.roles.cache.has("1046503404769382532") && // Administration
        !msg.member.roles.cache.has("1003321540089221240") && // Contributor
        !msg.member.roles.cache.has("1042307835784069150") && // VIP
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
