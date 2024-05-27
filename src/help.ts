import { EmbedBuilder, Message } from "discord.js";

export function help(message: Message): void {
  // image needs to inclue .png at the end
  const embed = new EmbedBuilder()
    .setColor("#fed85d")
    .setTitle("List of Commands")
    .setDescription("-----------------------")
    .setThumbnail("https://imgur.com/E9OtBTG.png")
    .addFields(
      {
        name: "🛡️ Help",
        value: "`-help`: list the available commands\n\u200b",
      },
      {
        name: "🎲 Wordle",
        value: "`-wordle`: create a new wordle game\n\u200b",
      },
      {
        name: "🎲 Hangman",
        value:
          "`-hangman`: create a new hangman game (topic: Video Games)\n*(Not available yet)*\n\u200b",
      },
      {
        name: "🏀 Ligma",
        value: "`ligma`: get the rest of the phrase\n\u200b",
      },
      {
        name: "🔨 Ban words",
        value:
          "`-banw`: delete messages that contain the banned word and timeout the sender\n*(Not available yet)*",
      }
    );
  message.channel.send({ embeds: [embed] });
}
