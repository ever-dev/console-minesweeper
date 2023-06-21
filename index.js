const { rl, prompt } = require("./utils/prompt.js");
const { startGame } = require("./main/game.js");

(async () => {
  console.log(
    "Welcome to Minesweeper!\nPlease input the number of rows, number of columns, and the number of mines to get started."
  );

  let playAgain;

  do {
    const rows = await prompt("Number of rows:");
    const columns = await prompt("Number of columns:");
    const mines = await prompt("Number of mines:");

    try {
      await startGame(Number(rows), Number(columns), Number(mines));
    } catch (e) {
      console.log(e.message);
    }
    playAgain = (
      await prompt("Do you want to play again (Y)es/(N)o?")
    ).toLowerCase();
  } while (playAgain === "y" || playAgain === "yes");

  rl.close();
})();
