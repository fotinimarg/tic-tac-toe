function Player(name) {
  let symbol = "";

  const setSymbol = (newSymbol) => {
    symbol = newSymbol;
  };

  const getSymbol = () => symbol;
  return { name, setSymbol, getSymbol };
}

const gameboard = (function () {
  let gameboardArray = [
    ["X", "", ""],
    ["", "", "X"],
    ["", "X", ""],
  ];

  const getPositionSymbol = (x, y) => gameboardArray[x][y];

  const setGameboard = (x, y, symbol) => {
    if ((x, y >= 0 && x, y < 3 && gameboardArray[x][y] === "")) {
      gameboardArray[x][y] = symbol;
    }
  };

  const getGameboard = () => gameboardArray;

  const resetGameboard = () => {
    gameboardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  return { getPositionSymbol, setGameboard, resetGameboard, getGameboard };
})();

const displayController = (function () {
  const container = document.querySelector(".container");

  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      container.appendChild(square);
    }
  }

  const displayGameboard = () => {
    let squares = document.querySelectorAll(".square");

    let squareNum = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const symbol = gameboard.getPositionSymbol(i, j);
        squares[squareNum].textContent = symbol;
        squareNum++;
      }
    }
  };

  const winner = (player) => {
    const winDiv = document.createElement("div");
    winDiv.textContent = "Winner is: " + player.name;
    document.appendChild(winDiv);
  };

  const newButton = document.querySelector(".new-round");
  newButton.addEventListener("click", (e) => {
    gameboard.resetGameboard();
    displayGameboard();
  });
})();

const controller = (function () {
  const checkRow = (row, symbol) => {
    for (let col = 0; col < 3; col++) {
      if (gameboard.getPositionSymbol(row, col) !== symbol) {
        return false;
      }
    }
    return true;
  };

  const checkColumn = (col, symbol) => {
    for (let row = 0; row < 3; row++) {
      if (gameboard.getPositionSymbol(row, col) !== symbol) {
        return false;
      }
    }
    return true;
  };

  const checkDiagonals = (symbol) => {
    const diag1 =
      gameboard.getPositionSymbol(0, 0) === symbol &&
      gameboard.getPositionSymbol(1, 1) === symbol &&
      gameboard.getPositionSymbol(2, 2) === symbol;

    const diag2 =
      gameboard.getPositionSymbol(0, 2) === symbol &&
      gameboard.getPositionSymbol(1, 1) === symbol &&
      gameboard.getPositionSymbol(2, 0) === symbol;

    return diag1 || diag2;
  };

  const player1 = Player("Fot");
  const player2 = Player("Jorge");

  player1.setSymbol("X");
  player2.setSymbol("O");

  let current = player1.getSymbol() === "X" ? player1 : player2;

  while (1) {
    //let x = Number(prompt("Give position x"));
    //let y = Number(prompt("Give position y"));

    const s = current.getSymbol();
    gameboard.setGameboard(x, y, s);
    displayController.displayGameboard();

    if (checkRow(x, s) || checkColumn(y, s) || checkDiagonals(s)) {
      break;
    }

    current = current === player1 ? player2 : player1;
    console.log(gameboard.getGameboard());
  }

  displayController.winner(current);
  console.log("Winner: " + current.name);
})();
