const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; }
  body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f1f5f9; color: #172033; font: 16px/1.5 system-ui, sans-serif; }
  main { padding: 20px; text-align: center; }
  .board { width: min(80vw, 480px); aspect-ratio: 1; display: grid; grid-template-columns: repeat(8, 1fr); border: 8px solid #334155; box-shadow: 0 12px 30px #17203325; }
  .square { display: grid; place-items: center; font-size: clamp(18px, 6vw, 42px); }
  .light { background: #f0d9b5; }
  .dark { background: #769656; }
`;
document.head.append(style);

const heading = document.createElement("h1");
heading.textContent = "Chessboard";
const board = document.createElement("div");
board.className = "board";
board.setAttribute("role", "grid");
board.setAttribute("aria-label", "8 by 8 chessboard");

for (let row = 0; row < 8; row += 1) {
  for (let column = 0; column < 8; column += 1) {
    const square = document.createElement("div");
    const isLight = (row + column) % 2 === 0;
    square.className = `square ${isLight ? "light" : "dark"}`;
    square.setAttribute("role", "gridcell");
    square.setAttribute("aria-label", `${String.fromCharCode(97 + column)}${8 - row}${isLight ? ", light" : ", dark"}`);
    board.append(square);
  }
}
document.querySelector("#app").append(heading, board);
