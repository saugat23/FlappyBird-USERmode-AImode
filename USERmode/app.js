import { updateBird, setupBird, getBirdRect } from "./bird.js";
import {
  updatePipes,
  setupPipes,
  getPassedPipesCount,
  getPipeRects,
} from "./pipe.js";

const userMode = document.querySelector("#usermode");
const logoDiv = document.querySelector("#logodiv");
const endMenu = document.querySelector("#endmenu");
const buttons = document.querySelector("#buttons");
const liveScore = document.querySelector("#livescore");

userMode.addEventListener("click", handleStart, { once: true });

let lastTime;
function updateLoop(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }
  const delta = time - lastTime;
  updateBird(delta);
  updatePipes(delta);
  if (checkLose()) return handleLose();
  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function checkLose() {
  const birdRect = getBirdRect();
  const insidePipe = getPipeRects().some((rect) => isCollision(birdRect, rect));
  const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight;
  return outsideWorld || insidePipe;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleStart() {
  endMenu.classList.add("hide");
  logoDiv.classList.add("hide");
  buttons.classList.add("hide");
  setupBird();
  setupPipes();
  lastTime = null;
  window.requestAnimationFrame(updateLoop);
}

function handleLose() {
  setTimeout(() => {
    endMenu.classList.remove("hide");
    liveScore.textContent = `${getPassedPipesCount()}`;
    document.addEventListener("keypress", handleStart, { once: true });
  }, 200);
}
