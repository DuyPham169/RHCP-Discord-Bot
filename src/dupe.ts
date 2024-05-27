import * as fs from "fs";

fs.readFile("./src/words.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("dupe.ts error: ", err);
  }

  const words: string[] = data.split("\r\n");
  const wordSet: Set<string> = new Set([]);
  const wrongWordSet: Set<string> = new Set([]);
  const dupeSet: Set<string> = new Set([]);
  for (let i = 0; i < words.length; ++i) {
    if (words[i].length !== 5) {
      wrongWordSet.add(words[i]);
    }
    if (wordSet.has(words[i])) {
      dupeSet.add(words[i]);
    } else {
      wordSet.add(words[i]);
    }
  }

  console.log("\nDuplicate string: ", dupeSet);
  console.log("Wrong words: ", wrongWordSet);
  console.log("Number of words: ", words.length, "\n");
});
