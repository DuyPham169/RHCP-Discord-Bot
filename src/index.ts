import { Client, Message } from "discord.js";
import { help } from "./help";
import { wordle } from "./wordle";
import "dotenv/config";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is ready!`);
});

function manageMessage(message: Message): void {
  // displayName: global name
  // username = tag: username
  if (message.author.bot) {
    return;
  }

  const messageLower = message.content.toLowerCase();

  if (messageLower === "ligma") {
    message.reply("BALLS!");
    message.react("⚽");
  }

  if (
    message.channel &&
    (messageLower === "-wordle" || messageLower === "-w")
  ) {
    wordle(client, message);
  }

  if (message.channel && (messageLower === "-help" || messageLower === "-h")) {
    help(message);
  }
}

client.on("messageCreate", manageMessage);

client.login(process.env.TOKEN);
