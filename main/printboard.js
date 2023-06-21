const chalk = require("chalk");

const CELL_COLORS = {
  1: "#2b12ff",
  2: "#2b7b00",
  3: "#cc0000",
  4: "#0f047c",
  5: "#720000",
  6: "#307b7b",
  7: "#000000",
  8: "#7b7b7b",
  "*": "#eee",
  " ": "#000",
  "-": "#888",
};

const renderers = Object.entries(CELL_COLORS).reduce(
  (acc, [key, color]) => ({ ...acc, [key]: chalk.hex(color) }),
  {}
);

/**
 *
 * @param {*} board : 2D array representation of board
 * @param {*} revealedCells : 2D array revealed status of board
 */
const printBoard = (board, revealedCells) => {
  board.forEach((row, rowIndex) => {
    console.log(
      row
        .map((cell, cellIndex) => {
          const displayValue = revealedCells[rowIndex][cellIndex]
            ? cell === 0
              ? " "
              : cell
            : "-";
          return renderers[displayValue](displayValue);
        })
        .join("")
    );
  });
};

module.exports = printBoard;
