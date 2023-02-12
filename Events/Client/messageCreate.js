const {
  EmbedBuilder,
  ThreadAutoArchiveDuration,
  InteractionCollector,
} = require("discord.js");
const Database = require("../../Schemas/Points");
const ms = require("ms");
const { message } = require("noblox.js");

const PointModifiers = [];
const PendingActions = [];

const NoPing = ["343875291665399818", "606035652789796881"];
const RuleIdentifiers = {
  warn: 4, // split
  mute: 5,
};

const RulePoints = {
  1: 1,
  3: 1,
  2: 2,
  7: 2,
  4: 3,
  5: 5,
  6: 5,
};

module.exports = {
  name: "messageCreate",
  async execute(msg) {
    if (!msg.guild) return;

    /*if (
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
    }*/

    if (msg.channelId === "1050841814631993427") {
      if (msg.webhookId && msg.content !== "") {
        const thread = await msg.startThread({
          name: msg.content,
          autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          reason: "AUTOMATION: Attached thread to game ban appeal",
        });

        await thread.members.add("1010879762664796190");
        return;
      }
    }

    try {
      if (msg.webhookId) return;

      if (
        !msg.member.roles.cache.has("796855972047618058") && // bot
        !msg.member.roles.cache.has("1057031499544793138") && // Co Ownership
        !msg.member.roles.cache.has("817669388337152060") && // Development
        !msg.member.roles.cache.has("1046503404769382532") && // Administration
        !msg.member.roles.cache.has("1003321540089221240") && // Contributor
        !msg.member.roles.cache.has("1042307835784069150") // VIP
      ) {
        const IdArray = Array.from(msg.mentions.members);
        let DeveloperDetected = false;
        let CCDetected = false;
        for (const [key, value] of Object.entries(IdArray)) {
          const Member = msg.guild.members.cache.find(
            (user) => user.id === value[0].toString()
          );
          if (Member) {
            if (Member.roles.cache.has("817669388337152060")) {
              if (!NoPing.includes(Member.id.toString())) {
                if (msg.content.includes(`<@${Member.id}>`)) {
                  DeveloperDetected = true;

                  break;
                }
              }
            } else if (Member.roles.cache.has("822489911331913748")) {
              if (!NoPing.includes(Member.id.toString())) {
                if (msg.content.includes(`<@${Member.id}>`)) {
                  CCDetected = true;

                  break;
                }
              }
            }
          }
        }

        if (DeveloperDetected === true) {
          const Embed = new EmbedBuilder()
            .setTitle("❌ Do Not @ Developers")
            .setColor("#e0392d")
            .setDescription(
              "Pinging developers is a violation of [Rule 3](https://discord.com/channels/739910144254673046/1016528431246217228/1056973562604421130)"
            );
          //.setImage("https://i.imgur.com/oCwYJBD.png");

          msg.client.channels.cache
            .get(msg.channel.id)
            .send({ content: "<@" + msg.author.id + ">", embeds: [Embed] });
        }
        /*if (CCDetected === true) {
          const Embed = new EmbedBuilder()
            .setTitle("❌ Do Not @ Content Creators")
            .setColor("#e0392d")
            .setDescription(
              "Pinging content creators may be subject to a violation of [Rule 3](https://discord.com/channels/739910144254673046/1016528431246217228)"
            );
          //.setImage("https://i.imgur.com/oCwYJBD.png");

          msg.client.channels.cache
            .get(msg.channel.id)
            .send({ content: "<@" + msg.author.id + ">", embeds: [Embed] });

          return;
        }*/
      }
    } catch (err) {
      console.log(err);
    }

    // POINT AUTOMATION
    try {
      if (msg.webhookId) return;

      if (
        !msg.member.roles.cache.has("1046503404769382532") &&
        !msg.member.roles.cache.has("1057031499544793138")
      ) {
        if (msg.guild.id !== "594760698639155200") {
          return;
        }
      }

      const Args = msg.content.split(" ");

      if (!Args[1]) return;
      if (isNaN(Args[1])) {
        if (Args[1].indexOf("@") > -1) {
          const Raw = Args[1];
          Args[1] = Raw.split("@").pop().split(">")[0];
        } else return;
      }

      let Member;

      if (
        !msg.guild.members.cache.get(Args[1]) ||
        msg.guild.members.cache.get(Args[1]) === null
      )
        return;

      EligibleMembers = await msg.guild.members.search({
        query: msg.guild.members.cache.get(Args[1]).user.username,
      });

      for (const [key, guildMember] of Array.from(EligibleMembers)) {
        if (guildMember.user.id === Args[1]) {
          Member = msg.guild.members.cache.get(guildMember.user.id);
          break;
        }
      }

      if (!Member || Member === null) {
        console.log("No member found, returning...");
        return;
      }

      for (const [key, value] of Object.entries(RuleIdentifiers)) {
        if (key === Args[0].slice(1)) {
          var Index = Args[value - 1].toString();
          if (Index !== null || Index !== undefined) {
            if (Index.length === 2) {
              Index = Index.slice(0, -1);
            }
          }
          const AddPoint = RulePoints[Index];

          if (!AddPoint || AddPoint === null) {
            AddPoint = 1;
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
          userData.Points = CurrentPoints + AddPoint;

          await userData.save();

          msg.channel.send(
            `*<:TimothyThink:881905210065293363>* *${Member.user.username}* has **${userData.Points}** points`
          );

          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
