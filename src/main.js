/* eslint-disable require-jsdoc */
let i = 0;
let canvas = null;
let ctx = null;
let cellWidth = 0;
let cellHeight = 0;
let stopped = true;
let isDrawing = false;

let cellCount = 300;
let cells;
let newCells;
let fillStyle = '#fff';
let circle = true;

const init = () => {
  cellWidth = ctx.canvas.width / cellCount;
  cellHeight = ctx.canvas.height / cellCount;
  cells = new Array(cellCount).fill(
    new Array(cellCount).fill(0),
  ).map((cellRow) => {
    return cellRow.map((cell) => {
      return Math.random() > 0.5
    })
  })
}

const getNoNeighbors = (x, y) => {
  let neighbors = 0;

  if (y < cellCount - 1) {
    // top
    neighbors += cells[x][y + 1];
  }
  if (x < cellCount - 1) {
    if (y < cellCount - 1) {
      // top right corner
      neighbors += cells[x + 1][y + 1];
    }
    // right
    neighbors += cells[x + 1][y];
    if (y > 0) {
      // bottom right corner
      neighbors += cells[x + 1][y - 1];
    }
  }
  if (x > 0) {
    if (y < cellCount - 1) {
      // top left corner
      neighbors += cells[x - 1][y + 1]
    }
    // left
    neighbors += cells[x - 1][y]
    if (y > 0) {
      // bottom left corner
      neighbors += cells[x - 1][y - 1]
    }
  }
  if (y > 0) {
    // bottom
    neighbors += cells[x][y - 1];
  }

  return neighbors;
}

const generate = () => {
  newCells = [];

  for (let x = 0; x < cellCount; x++) {
    if (!newCells[x]) newCells[x] = [];
    for (let y = 0; y < cellCount; y++) {
      let neighbors = getNoNeighbors(x, y);
      let outcome = false;

      if (cells[x][y] == 1) {
        if (neighbors < 2 || neighbors > 3) {
          outcome = false;
        } else {
          outcome = true;
        }
      } else if (cells[x][y] == 0) {
        if (neighbors === 3) {
          outcome = true;
        }
      }
      newCells[x][y] = outcome;

    }
  }

  return newCells;
}

const draw = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  newCells = [...cells];
  for (let x = 0; x < cellCount; x++) {
    for (let y = 0; y < cellCount; y++) {
      if (cells[x][y]) {
        ctx.fillStyle = fillStyle;
        if (circle) {
          ctx.beginPath();
          ctx.arc(x * cellWidth, y * cellHeight, (cellWidth / 3), 0, 2 * Math.PI, false);
          ctx.fill();
        } else {
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }

};

function play() {
  cells = generate();
  draw();
  if (stopped === false) {
    window.requestAnimationFrame(play);
  }
}

function stop() {
  stopped = true;
}

window.onload = () => {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  cellCount = Math.round(window.innerWidth / 10);
  window.addEventListener('resize', () => {
    cellWidth = ctx.canvas.width / cellCount;
    cellHeight = ctx.canvas.height / cellCount;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    window.requestAnimationFrame(draw);
  }, false);

  const darkModeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  fillStyle = darkModeOn ? '#fff' : '#000'
  console.log('dark mode', darkModeOn);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const darkModeOn = e.matches;
    console.log('dark mode', darkModeOn);
    fillStyle = darkModeOn ? '#fff' : '#000'
  });

  init();
  stopped = false;
  window.requestAnimationFrame(play);

  window.document.getElementById('max').addEventListener('input', (e) => {
    cellCount = Number(e.target.value);
    init();
    window.requestAnimationFrame(draw);
  })
  window.document.getElementById('play-button').addEventListener('click', (e) => {
    stopped = false;
    window.requestAnimationFrame(play);
  })
  window.document.getElementById('pause-button').addEventListener('click', (e) => {
    stopped = true;
  })
  window.document.getElementById('run-button').addEventListener('click', (e) => {
    window.requestAnimationFrame(play);
  })
  window.document.getElementById('circle').addEventListener('change', (e) => {
    circle = e.target.checked;
  })



  const getEventPosition = (e) => {
    let rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }
  canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    let { x, y } = getEventPosition(e);
    cells[Math.floor(x / window.innerWidth * cellCount)][Math.floor(y / window.innerHeight * cellCount)] = true;
    window.requestAnimationFrame(draw);
  });
  canvas.addEventListener("mousemove", function (e) {
    if (isDrawing) {
      let { x, y } = getEventPosition(e);
      cells[Math.floor(x / window.innerWidth * cellCount)][Math.floor(y / window.innerHeight * cellCount)] = true;
      window.requestAnimationFrame(draw);
    }
  });
  canvas.addEventListener("mouseup", function (e) {
    isDrawing = false;
  });
};
