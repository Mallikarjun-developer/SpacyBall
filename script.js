const message = document.querySelector(".message");
const scoreOutput = document.querySelector(".score");
const st = document.querySelector(".st");
const container = document.querySelector(".container");
const hero = document.querySelector(".hero");
let boundHero = hero.getBoundingClientRect();
const finalscore = document.querySelector(".final-score");
const gameover = document.querySelector(".gameover");
const ted = document.querySelector(".ted");
const restart = document.querySelector(".restart");
let boundContainer = container.getBoundingClientRect();
let infoicon = document.querySelector(".info-icon");
let cross = document.querySelector(".cross");

st.addEventListener("click", startGame);
cross.addEventListener("click", crossdisable);
restart.addEventListener("click", startGame);
infoicon.addEventListener("click", info);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);

let player = {
  score: 0,
  vill: 1,
  dark: 10000,
  inPlay: false,
  speed: 5,
};

//Mouse Keys
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function pressKeyOn(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function pressKeyOff(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function info() {
  document.querySelector(".game-instructions").style.display = "block";
}

function crossdisable() {
  document.querySelector(".game-instructions").style.display = "none";
}

function startGame() {
  document.querySelector(".top").style.opacity = "1";
  infoicon.style.display = "none";
  message.style.display = "none";
  finalscore.style.display = "none";
  gameover.style.display = "none";
  st.style.display = "none";
  hero.style.display = "block";
  ted.style.display = "none";
  player.score = 0;
  player.vill = 1;
  player.dark = 1000;
  player.inPlay = true;
  restart.style.display = "none";
  scoreupdate();
  setupballs(11);
  requestAnimationFrame(playGame);
}

function playGame() {
  if (player.inPlay == true) {
    if (
      keys.ArrowDown &&
      boundHero.y < boundContainer.height - boundHero.height - 18
    )
      boundHero.y += player.speed;
    if (keys.ArrowUp && boundHero.y > 0) boundHero.y -= player.speed;
    if (keys.ArrowLeft && boundHero.x > 0) boundHero.x -= player.speed;
    if (
      keys.ArrowRight &&
      boundHero.x < boundContainer.width - boundHero.width - 18
    )
      boundHero.x += player.speed;
    hero.style.left = boundHero.x + "px";
    hero.style.top = boundHero.y + "px";
    requestAnimationFrame(playGame);

    let tempEnemy = document.querySelectorAll(".vill");
    let tempFriend = document.querySelectorAll(".dark");
    for (let ball = 0; ball < tempFriend.length; ball++) {
      bgMover(tempEnemy[ball]);
      bgMover(tempFriend[ball]);
    }
  }
}

function bgMover(e) {
  e.x += e.speed;
  if (e.x > boundContainer.width - 100) {
    e.x = 100;
    e.y = Math.floor(Math.random() * boundContainer.height - 75);
    if (e.y == 0) e.y = 0;
    if (e.y > boundContainer.height - 75 || e.y < 0) e.y = 100;
    e.style.top = e.y + "px";
  }
  e.style.left = e.x + "px";
  console.log(e.x, e.y);
  isCollide(hero, e);
}

function setupballs(num) {
  for (let x = 0; x < num; x++) {
    makedark();
    makevill();
  }
}

function makedark() {
  if (player.dark > 0) {
    let temp = player.dark;
    let div = document.createElement("div");
    div.classList.add("dark");
    div.x = Math.floor(Math.random() * 710);
    if (div.x < 0) div.x = 100;
    div.y = 0.5625;
    div.speed = Math.ceil(Math.random() * 1) + 3;
    container.appendChild(div);
    div.style.left = div.y + "px";
    div.style.top = div.x + "px";
  }
}

function makevill() {
  if (player.vill > 0) {
    let temp = player.vill;
    let div = document.createElement("div");
    div.classList.add("vill");
    div.x = Math.floor(Math.random() * boundContainer.width - 100);
    if (div.x < 0) div.x = 100;
    div.y = 0;
    div.speed = Math.ceil(Math.random() * 1) + 3;
    container.appendChild(div);
    div.style.left = div.y + "px";
    div.style.top = div.x + "px";
  }
}

function endGame() {
  const dark = document.querySelectorAll(".dark");
  const vill = document.querySelectorAll(".vill");
  finalscore.textContent = `SCORE ${player.score}`;
  restart.style.display = "block";
  finalscore.style.display = "block";
  gameover.style.display = "block";
  document.querySelector(".top").style.opacity = "0";
  hero.style.display = "none";
  //Disappearing of hero and villain from the screen
  dark.forEach((node) => {
    node.style.display = "none";
  });
  vill.forEach((node) => {
    node.style.display = "none";
  });

  //storage of getting high score
  if (
    localStorage.getItem("score") < player.score ||
    localStorage.getItem("score") === null
  ) {
    finalscore.textContent = `NEW HIGH SCORE  ${player.score}`;
    finalscore.style.color = "yellow";
    localStorage.setItem("score", player.score);
  }
  player.inPlay = false;
}
//function of collision between hero and villain
function isCollide(a, b) {


  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  let pythag = getDistance(aRect.x, aRect.y, bRect.x, bRect.y);

  if (pythag < aRect.height / 2 + bRect.height / 2) {
    if (b.classList.value === "dark") {
      b.style.opacity = "0";
      vanish(b);
      player.score += 1;
      scoreupdate();
    } else endGame();
  }
}
//appearance after former time 
function vanish(b) {
  setInterval(() => {
    b.style.opacity = "10";
  }, 10000);
}

function getDistance(x1, y1, x2, y2) {
  let xdistance = x2 - x1 - 3;
  let ydistance = y2 - y1 - 2;
  let calc = Math.pow(xdistance, 2) + Math.pow(ydistance, 2);
  return Math.sqrt(calc);
}

function scoreupdate() {
  scoreOutput.textContent = player.score;
}
