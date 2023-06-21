const printBoard = require("./printboard.js");
const { MINE_SYMBOL } = require("./constants.js");
const { prompt } = require("../utils/prompt.js");

/**
 *
 * @param {Number} rowsNum : number of rows of board
 * @param {Number} colsNum : number of columns of board
 * @param {Number} minesNum : number of mines to generate
 * @returns {Array<[Number, Number]>} Position strings(row:col) of mines
 * @throws Error when number of mines are bigger than or equal to number of cells
 */
const generateMines = (rowsNum, colsNum, minesNum) => {
  if (minesNum >= rowsNum * colsNum) {
    throw new Error(
      "The number of mines must be smaller than the number of cells in the board."
    );
  }

  const used = [];
  while (used.length < minesNum) {
    const row = Math.floor(Math.random() * rowsNum);
    const col = Math.floor(Math.random() * colsNum);
    const pos = `${row}:${col}`;
    if (!used.includes(pos)) {
      used.push(pos);
    }
  }

  return used.map((pos) => pos.split(":").map((value) => Number(value)));
};

/**
 *
 * @param {[Number, Number]} position: [row, col] position of the main cell
 * @param {[Number]} rowsNum : number of rows in the board
 * @param {[Number]} colsNum : number of cells in the board
 * @returns
 */
const getNearbyCells = ([row, col], rowsNum, colsNum) => {
  return [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ].filter(
    ([rowNum, colNum]) =>
      rowNum >= 0 && rowNum < rowsNum && colNum >= 0 && colNum < colsNum
  );
};

/**
 *
 * @param {Number} rowsNum : number of rows of board
 * @param {Number} colsNum : number of columns of board
 * @param {Number} minesNum : number of mines to generate
 * @returns {2D Array} : 2D array of board
 */
const createBoard = (rowsNum, colsNum, minesNum) => {
  if (rowsNum === 0 || colsNum === 0) {
    throw new Error("Board should have at least one row and one column");
  }

  const board = new Array(rowsNum).fill().map(() => new Array(colsNum).fill(0));

  const minePositions = generateMines(rowsNum, colsNum, minesNum);

  minePositions.forEach(([row, col]) => {
    board[row][col] = MINE_SYMBOL;

    const nearbyCells = getNearbyCells([row, col], rowsNum, colsNum);

    nearbyCells.forEach(([rowNum, colNum]) => {
      if (board[rowNum][colNum] !== MINE_SYMBOL) {
        board[rowNum][colNum]++;
      }
    });
  });

  return board;
};

/**
 * @param {Number} rowsNum : number of rows
 * @param {Number} colsNum : number of columns
 * @param {2D Array} board : 2D array that represents board
 * @param {2D Array} revealed : 2D array revealed status of board
 * @param {[Number, Number]} position : point to start revealing
 * @returns status code of revealment action (false: reveal a mine, true: reveal non-mine cell)
 * @throws Error when the cell is already revealed
 */
const revealCells = (rowsNum, colsNum, board, revealed, [row, col]) => {
  if (revealed[row][col]) {
    throw new Error(`The cell(${row}:${col}) is already revealed.`);
  }

  revealed[row][col] = true;
  if (board[row][col] === MINE_SYMBOL) {
    return false;
  }

  if (board[row][col] === 0) {
    const newRevealCells = getNearbyCells([row, col], rowsNum, colsNum).filter(
      ([rowNum, colNum]) => revealed[rowNum][colNum] === false
    );

    while (newRevealCells.length > 0) {
      const [rowNum, colNum] = newRevealCells.pop();

      if (board[rowNum][colNum] === MINE_SYMBOL) {
        continue;
      }
      revealed[rowNum][colNum] = true;
      if (board[rowNum][colNum] === 0) {
        const nearbyCells = getNearbyCells(
          [rowNum, colNum],
          rowsNum,
          colsNum
        ).filter(([rowNum, colNum]) => revealed[rowNum][colNum] === false);
        newRevealCells.push(...nearbyCells);
      }
    }
  }
  return true;
};

const isGameWon = (board, revealed) => {
  const unrevealedCells = revealed.reduce(
    (acc, row, rowIndex) =>
      acc +
      row.filter(
        (cell, colIndex) =>
          cell === false && board[rowIndex][colIndex] !== MINE_SYMBOL
      ).length,
    0
  );
  return unrevealedCells === 0;
};

/**
 *
 * @param {Number} rowsNum : number of rows
 * @param {Number} colsNum : number of columns
 * @param {Number} minesNum : number of mines
 */
const startGame = async (rowsNum, colsNum, minesNum) => {
  const board = createBoard(rowsNum, colsNum, minesNum);
  const revealed = new Array(rowsNum)
    .fill()
    .map(() => new Array(colsNum).fill(false));

  // show board with all cells revealed
  printBoard(board, new Array(rowsNum).fill(new Array(colsNum).fill(true)));

  while (true) {
    try {
      const line = await prompt("Please input row and column:");
      const [row, col] = line.split(" ").map((value) => Number(value));

      const result = revealCells(rowsNum, colsNum, board, revealed, [row, col]);
      if (result === false) {
        console.log("You lose, you selected a mine.");
        break;
      }
      if (isGameWon(board, revealed)) {
        console.log("You won!");
        break;
      }
      console.log("You cleared an area, please continue.");
    } catch (e) {
      console.log(e.message);
    }
    printBoard(board, revealed);
  }
};

module.exports = {
  generateMines,
  createBoard,
  getNearbyCells,
  revealCells,
  startGame,
};
