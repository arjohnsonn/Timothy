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

const NoPing = [
  /*"343875291665399818", "606035652789796881"*/
];
const RuleIdentifiers = {
  warn: 4, // split
  mute: 5,
};

const Whitelist = ["warn", "mute", "softban", "ban"];
const RulePoints = {
  1: 1,
  3: 1,
  2: 2,
  7: 2,
  4: 3,
  5: 4,
  6: 3,
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

    if (msg.channelId === "1125416033201696948") {
      msg.react("⭐");
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

      const User = await msg.client.users.fetch(Args[1]);

      /*if (
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
      }*/

      if (!User || User === null) {
        console.log("No member found, returning...");
        return;
      }

      if (RuleIdentifiers[Args[0].slice(1)]) {
        for (const [key, value] of Object.entries(RuleIdentifiers)) {
          if (key === Args[0].slice(1)) {
            var Index = Args[value - 1].toString();
            if (Index !== null || Index !== undefined) {
              if (Index.length === 2) {
                Index = Index.slice(0, -1);
              }
            }
            var AddPoint = RulePoints[Index];

            if (!AddPoint || AddPoint === null) {
              const Action = Args[0].slice(1);
              if (Action === "warn") {
                AddPoint = 1;
              } else if (Action === "kick") {
                AddPoint = 2;
              } else if (Action === "softban") {
                AddPoint = 2;
              } else {
                AddPoint = 1;
              }
            }

            let userData = await Database.findOne({
              Guild: msg.guild.id,
              User: User.id,
            });
            if (!userData) {
              userData = await Database.create({
                Guild: msg.guild.id,
                User: User.id,
                Points: 0,
              });
            }

            const CurrentPoints = userData.Points;
            userData.Points = CurrentPoints + AddPoint;

            await userData.save();

            msg.channel.send(
              `*<:TimothyThink:881905210065293363>* *${User.username}#${User.discriminator}* has **${userData.Points}** points`
            );

            break;
          }
        }
      } else {
        const Action = Args[0].slice(1);

        if (!Whitelist.includes(Action)) return;
        if (Action === "warn") {
          AddPoint = 1;
        } else if (Action === "kick") {
          AddPoint = 2;
        } else if (Action === "softban") {
          AddPoint = 2;
        } else if (Action === "ban") {
          AddPoint = 4;
        } else {
          AddPoint = 1;
        }

        let userData = await Database.findOne({
          Guild: msg.guild.id,
          User: User.id,
        });
        if (!userData) {
          userData = await Database.create({
            Guild: msg.guild.id,
            User: User.id,
            Points: 0,
          });
        }

        const CurrentPoints = userData.Points;
        userData.Points = CurrentPoints + AddPoint;

        await userData.save();
        msg.channel.send(
          `*<:TimothyThink:881905210065293363>* *${User.username}#${User.discriminator}* has **${userData.Points}** points`
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
};
