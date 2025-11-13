import "./style.css";

const canvas = document.getElementById("gameSnake") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let score = 0 
const scoreHTML = document.getElementById("score") as HTMLBodyElement;
const devButton = document.getElementById("devButton") as HTMLBodyElement;

devButton.addEventListener("click", () => console.log(snake.snakeBody.length))

if (!ctx) {
  throw new Error("Failed to get 2D rendering context");
}

const snake = {
  radius: 25,
  speed: 2,
  direction: "right",
  snakeBody: [{x: 500, y: 100}]
}

const food = {
  x: 330,
  y: 130,
  radius: 10
}
 

function snakeGrow() {
  const body = {
    x: 0,
    y: 0,
  }
  
  switch (snake.direction) {
    case "up":
      body.x = snake.snakeBody[0].x
      body.y = snake.snakeBody[0].y + snake.radius * 2
      break;
    case "down":
      body.x = snake.snakeBody[0].x
      body.y = snake.snakeBody[0].y - snake.radius * 2
      break;
    case "left":
      body.x = snake.snakeBody[0].x + snake.radius * 2
      body.y = snake.snakeBody[0].y 
      break;
    case "right":
      body.x = snake.snakeBody[0].x - snake.radius * 2
      body.y = snake.snakeBody[0].y
      break;
  }

  snake.snakeBody.push(body)
  console.log("Snake grown")
}

function drawSnake() {
  for (let i = 0; i < snake.snakeBody.length; i++) {
    ctx.beginPath(); // ?
    ctx.arc(snake.snakeBody[i].x, snake.snakeBody[i].y, snake.radius, 0, Math.PI * 2); // ?
    ctx.fillStyle = "red";
    ctx.fill(); // ?
    ctx.closePath(); // ?
  }
}



function drawPoint() {
  ctx.beginPath(); // ?
  ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2); // ?
  ctx.fillStyle = "blue";
  ctx.fill(); // ?
  ctx.closePath(); // ?
}

function generatePoint() {
  const margin = 70
  food.x = Math.round(Math.random() * (canvas.width - margin * 2) + margin)
  food.y = Math.round(Math.random() * (canvas.height - margin * 2) + margin)
}



function checkPointGPT() {
  const dx = snake.snakeBody[0].x - food.x;
  const dy = snake.snakeBody[0].y - food.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < snake.radius + food.radius) {
    score += 1
    scoreHTML.textContent = "Twój wynik to: " + score
    generatePoint();
    snake.speed = snake.speed + 0.25
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
/**
 * pop() usuwa ostatni element tablicy
 * unshift() dodaje element na początku tablicy
 */

function updateSnake() {
  const newHead = {
    x: 0,
    y: 0
  } 
  switch (snake.direction) {
    case "up":
      newHead.y = snake.snakeBody[0].y - snake.speed;
      newHead.x = snake.snakeBody[0].x
      break;
    case "down":
      newHead.y = snake.snakeBody[0].y + snake.speed;
      newHead.x = snake.snakeBody[0].x
      break;
    case "left":
      newHead.y = snake.snakeBody[0].y
      newHead.x = snake.snakeBody[0].x - snake.speed;
      break;
    case "right":
      newHead.y = snake.snakeBody[0].y
      newHead.x = snake.snakeBody[0].x + snake.speed;
      break;
  }

  snake.snakeBody.unshift(newHead)

  if (snake.snakeBody.length > 1) {
    snake.snakeBody.pop()
  }

  // Odbicie od krawędzi
  if (snake.snakeBody[0].x + snake.radius > canvas.width || snake.snakeBody[0].x - snake.radius < 0) {
    snake.direction = snake.direction === "left" ? "right" : "left";
  }
  if (snake.snakeBody[0].y + snake.radius > canvas.height || snake.snakeBody[0].y - snake.radius < 0) {
    snake.direction = snake.direction === "up" ? "down" : "up";
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      if (snake.direction !== "down") snake.direction = "up";
      break;
    case "KeyS":
      if (snake.direction !== "up") snake.direction = "down";
      break;
    case "KeyA":
      if (snake.direction !== "right") snake.direction = "left";
      break;
    case "KeyD":
      if (snake.direction !== "left") snake.direction = "right";
      break;
    case "Space":
      snake.speed = snake.speed === 0 ? 2 : 0; // wstrzymanie/wznowienie ruchu
      break;
    default:
      console.log("Wciśnięto inny klawisz:", event.code);
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // metoda czyszczenia tablicy
  updateSnake();
  drawSnake();
  drawPoint();
  checkPointGPT();
  requestAnimationFrame(gameLoop);
}

gameLoop(); // Game start
