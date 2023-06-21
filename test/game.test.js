const { MINE_SYMBOL } = require("../main/constants.js");
const {
  generateMines,
  createBoard,
  getNearbyCells,
  revealCells,
} = require("../main/game.js");
const { rl } = require("../utils/prompt.js");

afterAll(() => {
  if (rl) {
    rl.close();
  }
});

describe("generateMines", () => {
  it("should fail with more mines than cells", () => {
    const rowsNum = 1 + Math.floor(Math.random() * 10);
    const colsNum = 1 + Math.floor(Math.random() * 10);
    expect(() => {
      generateMines(rowsNum, colsNum, rowsNum * colsNum);
    }).toThrowError();
  });

  it("should return correct number of mines", () => {
    const rowsNum = 1 + Math.floor(Math.random() * 10);
    const colsNum = 1 + Math.floor(Math.random() * 10);
    const minesNum = Math.floor((rowsNum * colsNum) / 2);
    expect(generateMines(rowsNum, colsNum, minesNum).length).toEqual(minesNum);
  });
});

describe("createBoard", () => {
  it("should fail with 0 size", () => {
    expect(() => {
      createBoard(0, 0, 0);
    }).toThrowError();
  });

  it("should create a board correctly", () => {
    const rowsNum = 1 + Math.floor(Math.random() * 10);
    const colsNum = 1 + Math.floor(Math.random() * 10);
    const minesNum = Math.floor((rowsNum * colsNum) / 2);
    const board = createBoard(rowsNum, colsNum, minesNum);

    // Check board size
    expect(
      board.length === rowsNum && board.every((row) => row.length === colsNum)
    ).toBe(true);

    // Check number of mines
    expect(
      board.reduce(
        (acc, row) => acc + row.filter((cell) => cell === MINE_SYMBOL).length,
        0
      ) === minesNum
    ).toBe(true);

    // Check if cells represent correct numbers
    expect(
      board.every((row, rowIndex) =>
        row.every((cell, colIndex) => {
          if (cell === MINE_SYMBOL) return true;
          const nearbyCells = getNearbyCells(
            [rowIndex, colIndex],
            rowsNum,
            colsNum
          );
          return (
            nearbyCells.filter(([x, y]) => board[x][y] === MINE_SYMBOL)
              .length === cell
          );
        })
      )
    ).toBe(true);
  });
});

describe("revealCells", () => {
  it("should throw an error if it's already revealed", () => {
    const rowsNum = 3;
    const colsNum = 3;
    const board = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, MINE_SYMBOL],
    ];
    const revealed = [
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const position = [0, 0];

    expect(() => {
      revealCells(rowsNum, colsNum, board, revealed, position);
    }).toThrowError("The cell(0:0) is already revealed.");
  });

  it("should return false if mine is selected", () => {
    const rowsNum = 3;
    const colsNum = 3;
    const board = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, MINE_SYMBOL],
    ];
    const revealed = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const position = [2, 2];

    expect(revealCells(rowsNum, colsNum, board, revealed, position)).toBe(
      false
    );
  });

  it("should return true and reveal area", () => {
    const rowsNum = 3;
    const colsNum = 3;
    const board = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, MINE_SYMBOL],
    ];
    const revealed = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const position = [0, 0];

    expect(revealCells(rowsNum, colsNum, board, revealed, position)).toBe(true);
    expect(revealed).toEqual([
      [true, true, true],
      [true, true, true],
      [true, true, false],
    ]);
  });
});
