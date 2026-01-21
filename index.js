function Player(name) {
  let symbol = "";
  let score = 0;

  const setSymbol = (newSymbol) => {
    symbol = newSymbol;
  };

  const increaseScore = () => {
    score++;
  };

  const getSymbol = () => symbol;
  const getScore = () => score;
  return { name, setSymbol, getSymbol, increaseScore, getScore };
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
  let gameStarted = false;
  let players;

  // Create grid for tic tac toe
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

  // Get users' names and choice of symbol
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const player1 = Player(formData.get("player1").trim());
    const player2 = Player(formData.get("player2").trim());
    player1.setSymbol(formData.get("symbol"));
    if (formData.get("symbol") === "X") {
      player2.setSymbol("O");
    } else {
      player2.setSymbol("X");
    }

    players = { player1, player2 };

    startGame();
  });

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

  const newButton = document.querySelector("#new-round");
  const resetButton = document.querySelector("#reset");
  const results = document.querySelector(".results");

  const startGame = () => {
    gameStarted = true;

    newButton.textContent = "New Round";
    resetButton.classList.remove("hidden");

    form.classList.add("hidden");
    form.reset();

    gameboard.resetGameboard();
    controller.newRound(players);
    displayGameboard();
  };

  const winner = (player) => {
    const win = document.querySelector(".win");
    const score = document.querySelector(".score");
    if (player) {
      results.classList.remove("hidden");
      player.increaseScore();
      score.textContent =
        "Score: " +
        players.player1.getScore() +
        " - " +
        players.player2.getScore();

      win.classList.remove("hidden");
      win.textContent = "Winner is: " + player.name;
    } else {
      win.classList.add("hidden");
    }
  };

  const resetGame = () => {
    gameboard.resetGameboard();
    controller.newRound(players);
    winner(null);
    displayGameboard();
  };

  newButton.addEventListener("click", () => {
    if (!gameStarted) {
      form.requestSubmit();
    } else {
      resetGame();
    }
  });

  resetButton.addEventListener("click", () => {
    gameStarted = false;
    players = null;
    winner(null);
    resetButton.classList.add("hidden");
    newButton.textContent = "Start";
    form.classList.remove("hidden");
    container.classList.add("hidden");
    results.classList.add("hidden");
  });

  return { displayGameboard, winner };
})();

const controller = (function () {
  // Check if we have same symbol in a row
  const checkRow = (row, symbol) => {
    for (let col = 0; col < 3; col++) {
      if (gameboard.getPositionSymbol(row, col) !== symbol) {
        return false;
      }
    }
    return true;
  };

  // Check if we have same symbol in a column
  const checkColumn = (col, symbol) => {
    for (let row = 0; row < 3; row++) {
      if (gameboard.getPositionSymbol(row, col) !== symbol) {
        return false;
      }
    }
    return true;
  };

  // Check if we have same symbol in diagonals
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

  let players;
  let current;
  let s;
  let gameOver = false;
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (gameOver || !current) {
        return;
      }

      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);

      // If it's not empty cell return
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

      // Change current player
      current = current === players.player1 ? players.player2 : players.player1;
      s = current.getSymbol();
    });
  });

  const newRound = (newPlayers) => {
    players = newPlayers;

    current =
      players.player1.getSymbol() === "X" ? players.player1 : players.player2;
    s = current.getSymbol();
    gameOver = false;

    // Show grid and remove disabled cursor when hovering.
    const container = document.querySelector(".container");
    container.classList.remove("hidden");
    squares.forEach((square) => {
      square.classList.remove("disabled");
    });
  };

  return { newRound };
})();
