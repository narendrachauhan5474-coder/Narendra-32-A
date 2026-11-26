const jumps = new Map([[3, 22], [8, 30], [28, 55], [58, 77], [75, 96], [17, 4], [52, 29], [57, 40], [88, 18], [97, 79]]);
const board = document.querySelector("#board");
const status = document.querySelector("#status");
const positions = [0, 0];
let currentPlayer = 0;
let finished = false;

function drawBoard() {
  board.replaceChildren();
  for (let square = 100; square >= 1; square -= 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (jumps.has(square)) cell.classList.add(jumps.get(square) > square ? "ladder" : "snake");
    const number = document.createElement("span");
    number.textContent = `${square}${jumps.has(square) ? ` ${jumps.get(square) > square ? "🪜" : "🐍"}` : ""}`;
    const tokens = document.createElement("span");
    tokens.className = "tokens";
    positions.forEach((position, index) => {
      if (position === square) {
        const token = document.createElement("span");
        token.textContent = index === 0 ? "🔵" : "🔴";
        token.setAttribute("aria-label", `Player ${index + 1}`);
        tokens.append(token);
      }
    });
    cell.append(number, tokens);
    board.append(cell);
  }
}

document.querySelector("#roll").addEventListener("click", () => {
  if (finished) return;
  const roll = Math.floor(Math.random() * 6) + 1;
  const playerName = `Player ${currentPlayer + 1}`;
  let next = positions[currentPlayer] + roll;
  if (next > 100) next = positions[currentPlayer];
  if (jumps.has(next)) next = jumps.get(next);
  positions[currentPlayer] = next;
  drawBoard();
  if (next === 100) {
    status.textContent = `${playerName} rolled ${roll} and wins!`;
    finished = true;
  } else {
    status.textContent = `${playerName} rolled ${roll} and moved to ${next}. Player ${(currentPlayer + 1) % 2 + 1}'s turn.`;
    currentPlayer = (currentPlayer + 1) % 2;
  }
});

document.querySelector("#reset").addEventListener("click", () => {
  positions[0] = 0;
  positions[1] = 0;
  currentPlayer = 0;
  finished = false;
  status.textContent = "Player 1's turn. Roll the dice!";
  drawBoard();
});
drawBoard();
