import "./style.css";

const canvas = document.getElementById("gameSnake") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

if (!ctx) {
  throw new Error("Failed to get 2D rendering context");
}

const snakeHead = {
  x: 500,
  y: 100,
  radius: 25,
  speed: 2,
  direction: "right",
}
 
type SnakeSegment = {
  X: number;
  Y: number;
  direction: string
};
const snakeBody: SnakeSegment[] = []

function snakeGrow() {
  const body = {
    X: 0,
    Y: 0,
    direction: ""
  }
  
  switch (snakeHead.direction) {
    case "up":
      body.X = snakeHead.x
      body.Y = snakeHead.y + snakeHead.radius * 2
      break;
    case "down":
      body.X = snakeHead.x
      body.Y = snakeHead.y - snakeHead.radius * 2
      break;
    case "left":
      body.X = snakeHead.x + snakeHead.radius * 2
      body.Y = snakeHead.y 
      break;
    case "right":
      body.X = snakeHead.x - snakeHead.radius * 2
      body.Y = snakeHead.y
      break;
  }

  snakeBody.push(body)
  console.log("Snake grown")
}

function drawSnake() {
  ctx.beginPath(); // ?
  ctx.arc(snakeHead.x, snakeHead.y, snakeHead.radius, 0, Math.PI * 2); // ?
  ctx.fillStyle = "red";
  ctx.fill(); // ?
  ctx.closePath(); // ?

  for (let i = 0; i < snakeBody.length; i++) {
    ctx.beginPath(); // ?
    ctx.arc(snakeBody[i].X, snakeBody[i].Y, snakeHead.radius, 0, Math.PI * 2); // ?
    ctx.fillStyle = "orange";
    ctx.fill(); // ?
    ctx.closePath(); // ?
  }
}
/*
snake to tablica 
w funkcji drawSnake będzie znajdować się pętla
ktora będzie literować przez tą tablice i kolejno generować punkty


*/
const point = {
  x: 330,
  y: 130,
  radius: 10
}

function drawPoint() {
  ctx.beginPath(); // ?
  ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2); // ?
  ctx.fillStyle = "blue";
  ctx.fill(); // ?
  ctx.closePath(); // ?
}

function generatePoint() {
  const margin = 70
  point.x = Math.round(Math.random() * (canvas.width - margin * 2) + margin)
  point.y = Math.round(Math.random() * (canvas.height - margin * 2) + margin)
}

let score = 0 
const scoreHTML = document.getElementById("score") as HTMLBodyElement;

function checkPoint() {
  // moja funkcja - sprawdzam czy podane punkty się nachodzą
  if (point.x > (snakeHead.x-snakeHead.radius) && point.x < (snakeHead.x+snakeHead.radius) && point.y > (snakeHead.y-snakeHead.radius) && point.y < (snakeHead.y+snakeHead.radius)) {
    score++
    scoreHTML.textContent = "Twój wynik to: " + score
    generatePoint();
    snakeHead.speed = snakeHead.speed + 0.25
  }
}

function checkPointGPT() {
  const dx = snakeHead.x - point.x;
  const dy = snakeHead.y - point.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < snakeHead.radius + point.radius) {
    score += 1
    scoreHTML.textContent = "Twój wynik to: " + score
    generatePoint();
    snakeHead.speed = snakeHead.speed + 0.25
    snakeGrow();
  }

  /*
    Sposob rozwiązania kolizi przez GPT.
    Sprawdza dystans między głową węża a jedzeniem.
    Jeśli dystans jest mniejszy niż suma promienia węża i jedzenia czyli wystepuje kolizja

    Dystans to linia której długość jest obliczana z twierdzenia pitagorasa.
    a kwadrat + b kwadrat = c kwadrat
    Dokładnie mówiąc to jest własnie "c kwadrat" 

    Sprobuj narysować sobie trójkąt prostokątny, środek węża i środek jedzenia to punkty styku
    przeciw prostokątniej z liniami przyprostokątnymi 
    dx to "a"
    dy to "b"
    distance to "c"

    Wynikiem Math.sqrt jest pierwiastek liczby (dla 9 to 3, 16 to 4) 
    Math.sqrt(dx * dx + dy * dy)
    Math.sqrt("a kwadrat" + "b kwadrat")
  */
}


function updateSnake() { 
  switch (snakeHead.direction) {
    case "up":
      snakeHead.y -= snakeHead.speed;
      break;
    case "down":
      snakeHead.y += snakeHead.speed;
      break;
    case "left":
      snakeHead.x -= snakeHead.speed;
      break;
    case "right":
      snakeHead.x += snakeHead.speed;
      break;
  }

  /*
    literujesz przez tablice snakeBody
    jesli poprzedni punkt

  */

  // Odbicie od krawędzi
  if (snakeHead.x + snakeHead.radius > canvas.width || snakeHead.x - snakeHead.radius < 0) {
    snakeHead.direction = snakeHead.direction === "left" ? "right" : "left";
  }
  if (snakeHead.y + snakeHead.radius > canvas.height || snakeHead.y - snakeHead.radius < 0) {
    snakeHead.direction = snakeHead.direction === "up" ? "down" : "up";
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      if (snakeHead.direction !== "down") snakeHead.direction = "up";
      break;
    case "KeyS":
      if (snakeHead.direction !== "up") snakeHead.direction = "down";
      break;
    case "KeyA":
      if (snakeHead.direction !== "right") snakeHead.direction = "left";
      break;
    case "KeyD":
      if (snakeHead.direction !== "left") snakeHead.direction = "right";
      break;
    case "Space":
      snakeHead.speed = snakeHead.speed === 0 ? 2 : 0; // wstrzymanie/wznowienie ruchu
      break;
    default:
      console.log("Wciśnięto inny klawisz:", event.code);
  }
});

// --- Główna pętla gry ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // metoda czyszczenia tablicy
  updateSnake();
  drawSnake();
  drawPoint();
  checkPointGPT();
  requestAnimationFrame(gameLoop);
}

gameLoop(); // Game start
