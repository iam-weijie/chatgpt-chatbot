import openai from "./config/openai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.bold.green("J.A.R.V.I.S. at your service!"));

  const chatHistory = []; // store conversation history to save the context

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You: "));

    try {
      // construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // add latest user input
      messages.push({ role: "user", content: userInput });

      // call the api with user input
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      // get completion text/content
      const completionText = chatCompletion.choices[0].message;

      if (
        userInput.toLocaleLowerCase() === "jarvis off" ||
        userInput.toLocaleLowerCase() === "off"
      ) {
        console.log(colors.green("J.A.R.V.I.S: As you wish."));
        return;
      }

      console.log(colors.green("J.A.R.V.I.S: ") + completionText);

      // update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();
