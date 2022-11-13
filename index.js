const dotenv = require("dotenv");
dotenv.config();

const { token } = process.env;

const {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
  Embed,
  Partials,
  Collection,
} = require("discord.js");

const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMessages, GuildMembers, MessageContent, 32767],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler.js");

client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

client
  .login(token)
  .then(() => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence({
      activities: [{ name: `with a ban hammer`, type: ActivityType.Playing }],
      status: "dnd",
    });
  })
  .catch((err) => console.log(err));
