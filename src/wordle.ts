import { EmbedBuilder, Message, Client } from "discord.js";
import * as fs from "fs";
import en from "dictionary-en";
import nspell from "nspell";

const spell = nspell(en.aff.toString(), en.dic.toString());

export function wordle(client: Client, mess: Message): void {
  let tries: number = 6;
  let playerWord: string = "";
  let gameState: boolean = false;
  const gameWord: string = getGameWord();
  const lettersInWord: Set<string> = new Set([]);
  const lettersNotInWord: Set<string> = new Set([]);
  const attemptString: string[] = [];
  for (let i = 0; i < 6; ++i) {
    attemptString[i] = "\\_ \\_ \\_ \\_ \\_\n";
  }

  console.log(gameWord);

  mess.channel.send({ embeds: [wordleEmbedBuilder()] });
  client.on("messageCreate", guess);

  function guess(message: Message) {
    if (
      message.channelId === mess.channelId &&
      message.content.match(/^[a-z]{5}$/i)
    ) {
      playerWord = message.content.toUpperCase();
      if (!spell.correct(playerWord)) {
        const invalidWord = new EmbedBuilder()
          .setTitle("**Wordle**")
          .setColor("#D2042D")
          .setDescription("Please enter a valid English word!");
        message.channel.send({ embeds: [invalidWord] });
        return;
      }

      tries--;
      const updateWordle = wordleEmbedBuilder();
      message.channel.send({ embeds: [updateWordle] });
      if (playerWord === gameWord) {
        gameState = true;
      }
    }

    if (tries <= 0 || gameState) {
      client.removeListener("messageCreate", guess);
      resultBuilder();
    }
  }

  function wordleEmbedBuilder(): EmbedBuilder {
    const embedMessage = new EmbedBuilder()
      .setTitle("**Wordle**")
      .setColor("#50C878")
      .setThumbnail("https://imgur.com/uEh4hda.png")
      .setDescription(
        "Guess the 5-letters word\n\n**Rules:**\n" +
          "- **Bold**: the letter is in the word and in the right position\n" +
          "- __Underline__: the letter is in the word but in the wrong position\n" +
          "- Regular: the letter is not in the word\n\u200b"
      )
      .addFields(
        { name: "Attempts", value: attemptsBuilder() },
        {
          name: "\u200b\nLetters in the word:",
          value: Array.from(lettersInWord).join(", ") || "\u200b",
        },
        {
          name: "Letters not in the word:",
          value: Array.from(lettersNotInWord).join(", ") || "\u200b",
        }
      )
      .setFooter({ text: `Attempts left: ${tries}` });
    return embedMessage;
  }

  function attemptsBuilder(): string {
    for (let i = 0; i < 6; ++i) {
      if (5 - tries === i) {
        const playerWordArray = playerWord.split("");
        for (let j = 0; j < 5; ++j) {
          if (gameWord.includes(playerWordArray[j])) {
            lettersInWord.add(playerWordArray[j]);
            if (playerWordArray[j] === gameWord.charAt(j)) {
              playerWordArray[j] = `**${playerWordArray[j]}**`;
            } else {
              playerWordArray[j] = `__${playerWordArray[j]}__`;
            }
          } else {
            lettersNotInWord.add(playerWordArray[j]);
          }
        }
        attemptString[i] = playerWordArray.join(" ") + "\n";
      }
    }
    return attemptString.join("");
  }

  function getGameWord(): string {
    let chosenWord = "";
    try {
      const data = fs.readFileSync("./src/words.txt", "utf-8");
      const words = data.split("\r\n");
      const wordIndex = Math.floor(Math.random() * words.length);
      chosenWord = words[wordIndex];
    } catch (err) {
      console.log("Error reading file: ", err);
    }
    return chosenWord;
  }

  function resultBuilder(): void {
    const result = new EmbedBuilder()
      .setTitle(gameState ? "**You won!**" : "**You lost!**")
      .setDescription(
        gameState
          ? `\u200b\nYou correctly guessed the word ${gameWord} in ${
              tries > 2 ? "just " : ""
            }${6 - tries} tries`
          : `\u200b\nYou failed to guess the word ${gameWord} with all 6 tries`
      )
      .setColor(gameState ? "#50C878" : "#D2042D")
      .setThumbnail("https://imgur.com/uEh4hda.png");
    mess.channel.send({ embeds: [result] });
  }
}
