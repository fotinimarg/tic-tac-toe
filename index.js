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
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const getPositionSymbol = (x, y) => gameboardArray[x][y];

  const setGameboard = (x, y, symbol) => {
    if ((x, y >= 0 && x, y < 3 && gameboardArray[x][y] === "")) {
      gameboardArray[x][y] = symbol;
      return true;
    } else {
      return false;
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
      square.dataset.x = i;
      square.dataset.y = j;
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
    const winDiv = document.querySelector(".win-div");
    if (player) {
      winDiv.classList.remove("hide");
      winDiv.textContent = "Winner is: " + player.name;
    } else {
      winDiv.classList.add("hide");
    }
  };

  const newButton = document.querySelector(".new-round");
  newButton.addEventListener("click", (e) => {
    gameboard.resetGameboard();
    controller.newRound();
    winner(null);
    displayGameboard();
  });

  return { displayGameboard, winner };
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
  let s = current.getSymbol();

  let x;
  let y;
  let gameOver = false;
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (gameOver) {
        return;
      }

      x = Number(e.target.dataset.x);
      y = Number(e.target.dataset.y);

      const returnVal = gameboard.setGameboard(x, y, s);
      if (!returnVal) {
        return;
      }
      e.target.classList.add("disabled");
      displayController.displayGameboard();

      if (checkRow(x, s) || checkColumn(y, s) || checkDiagonals(s)) {
        displayController.winner(current);
        gameOver = true;
        return;
      }

      current = current === player1 ? player2 : player1;
      s = current.getSymbol();
    });
  });

  const newRound = () => {
    current = player1.getSymbol() === "X" ? player1 : player2;
    s = current.getSymbol();

    gameOver = false;
    squares.forEach((square) => {
      square.classList.remove("disabled");
    });
  };

  return { newRound };
})();
