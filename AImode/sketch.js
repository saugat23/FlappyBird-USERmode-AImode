/* eslint-disable no-param-reassign */
import Pipe from "./pipe.js";
import Background from "./background.js";
import Bird from "./bird.js";

const myGame = new p5((main) => {
  const MUTATION_RATE = 0.09;
  const POPULATION_SIZE = 50;
  const gndHeight = 115;
  const pipeCount = 5000;
  const sprite = [];
  const bestBirdSprite = [];
  const pipe = [];
  let doScoring = true;
  let globalScore = 0;
  let bestGlobal = 0;
  let bird = [];
  let deadBirdIdx = [];
  let birdsDead = 0;
  let pipeIdx = 0;
  let skyRes;
  let gndRes;
  let font;
  let bg;
  let pipeInitX;
  let bestBirdIdx = 0;
  let generation = 1;

  const naturalSelection = () => {
    const newGen = [];
    newGen[0] = new Bird(main, bestBirdSprite, 4, true);
    newGen[0].brain = bird[bestBirdIdx].brain.copy();
    for (let i = 1; i < POPULATION_SIZE; i += 1) {
      newGen[i] = new Bird(main, sprite, 4, false);
      newGen[i].brain = bird[bestBirdIdx].brain.copy();
      newGen[i].brain.mutate(MUTATION_RATE);
    }
    return newGen;
  };

  const reset = () => {
    deadBirdIdx = [];
    birdsDead = 0;
    bg = new Background(skyRes, gndRes, gndHeight, 2);
    globalScore = 0;
    doScoring = true;
    pipeIdx = 0;
    pipeInitX = main.width + 100;
    for (let i = 0; i < pipeCount; i += 1) {
      pipe[i] = new Pipe(
        main,
        gndHeight,
        pipeInitX,
        sprite[4],
        sprite[5],
        sprite[6]
      );
      // pipe[i].x = pipeInitX;
      pipeInitX += 300;
    }
    generation += 1;
  };

  const findBestBird = () => {
    let maxScore = -1;
    for (let i = 0; i < POPULATION_SIZE; i += 1) {
      if (bird[i].fitnessScore > maxScore) {
        maxScore = bird[i].fitnessScore;
        bestBirdIdx = i;
      }
    }
  };

  const findElement = (arr, value) => {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] === value) return value;
    }
    return undefined;
  };

  const debug = () => {
    main.textSize(17);
    main.textAlign(main.LEFT);
    main.text("Generation:        " + generation, 20, 50);
    main.text(
      "Birds Alive:        " +
        (POPULATION_SIZE - birdsDead) +
        " / " +
        POPULATION_SIZE,
      20,
      70
    );
    for (let i = 0; i < POPULATION_SIZE; i += 1) {
      if (!bird[i].dead) {
        main.textSize(25);
        main.text("Bird " + i + "'s neural network", 2, 400);
        main.textAlign(main.RIGHT);
        // main.text(Math.floor(bird[i].fitnessScore), main.width - 10, 400);
        // main.textSize(17);
        // main.text('Fitness Score', main.width - 10, 370);
        main.textSize(17);
        main.text("X-Distance to Pipe ", 158, 446);
        main.text("Distance to Top Pipe ", 158, 491);
        main.text("Distance to Bottom Pipe ", 158, 536);
        main.text("Vertical Speed ", 158, 581);
        main.textSize(35);
        if (bird[i].outputs[0] >= 0.5) main.text("FLY !!", 350, 585);
        bird[i].brain.visualize(main, 180, 440, 150);
        main.fill(255);
        main.strokeWeight(1);
        main.rect(325, 465, 8, 70);
        main.triangle(340, 530, 330, 550, 320, 530);
        break;
      }
    }
  };

  const scoring = () => {
    main.fill(255);
    main.stroke(0);
    main.strokeWeight(3);
    main.textAlign(main.CENTER);
    main.textSize(50);
    const pipePairPositionX = pipe[pipeIdx].getPipePairPositionX();
    const dummyBirdX = 100 - 65 / 2;
    const dummyDistToPipe = pipePairPositionX - (dummyBirdX + 65);
    if (dummyDistToPipe < -132) pipeIdx += 1;
    main.text(globalScore, main.width / 2, 150);
    main.textSize(25);
    main.text("Best: " + bestGlobal, main.width / 2, 190);
    if (dummyDistToPipe < -30 && doScoring) {
      globalScore += 1;
      doScoring = false;
      if (globalScore > bestGlobal) bestGlobal = globalScore;
    } else if (dummyDistToPipe < -132) doScoring = true;
  };

  main.preload = () => {
    font = main.loadFont("fonts/BebasNeue.ttf");
    skyRes = main.loadImage("sprites/sky.png");
    gndRes = main.loadImage("sprites/ground.png");
    sprite[0] = main.loadImage("sprites/bird/bird-1.png");
    sprite[1] = main.loadImage("sprites/bird/bird-2.png");
    sprite[2] = main.loadImage("sprites/bird/bird-3.png");
    sprite[3] = main.loadImage("sprites/bird/bird-4.png");
    sprite[4] = main.loadImage("sprites/pipe/pipe_head_top.png");
    sprite[5] = main.loadImage("sprites/pipe/pipe_head_bottom.png");
    sprite[6] = main.loadImage("sprites/pipe/pipe_body.png");
    bestBirdSprite[0] = main.loadImage("sprites/bird/bird-best-1.png");
    bestBirdSprite[1] = main.loadImage("sprites/bird/bird-best-2.png");
    bestBirdSprite[2] = main.loadImage("sprites/bird/bird-best-3.png");
    bestBirdSprite[3] = main.loadImage("sprites/bird/bird-best-4.png");
  };

  main.setup = () => {
    main.createCanvas(400, 720);
    for (let i = 0; i < POPULATION_SIZE; i += 1) {
      bird[i] = new Bird(main, sprite, 4, false);
    }
    bg = new Background(skyRes, gndRes, gndHeight, 2);
    main.textFont(font);
    pipeInitX = main.width + 100;
    for (let i = 0; i < pipeCount; i += 1) {
      pipe[i] = new Pipe(
        main,
        gndHeight,
        pipeInitX,
        sprite[4],
        sprite[5],
        sprite[6]
      );
      pipeInitX += 300;
    }
  };

  main.draw = () => {
    main.imageMode(main.CORNER);
    bg.display(main);
    if (birdsDead !== POPULATION_SIZE) bg.scroll();
    for (let i = 0; i < pipeCount; i += 1) {
      if (
        pipe[i].getPipePairPositionX() >= -77 &&
        pipe[i].getPipePairPositionX() <= main.width
      )
        pipe[i].display(main, gndHeight);
      if (birdsDead !== POPULATION_SIZE) pipe[i].move();
    }
    scoring();
    main.imageMode(main.CENTER);
    for (let i = POPULATION_SIZE - 1; i >= 0; i -= 1) {
      if (!bird[i].dead) {
        bird[i].display(main);
        bird[i].animate();
        bird[i].think();
        bird[i].move();
        bird[i].getDistances(
          pipe[pipeIdx].getPipePairPositionX(),
          pipe[pipeIdx].getTopPipePositionY(),
          pipe[pipeIdx].getBottomPipePositionY(main, gndHeight),
          bird[i].getPositionY(),
          main.height - gndHeight
        );
        bird[i].checkCollision(main, gndHeight);
        bird[i].updateFitness();
      } else if (bird[i].dead && birdsDead !== POPULATION_SIZE) {
        const found = findElement(deadBirdIdx, i);
        if (found === undefined) {
          deadBirdIdx.push(i);
          birdsDead += 1;
        }
      }
    }
    debug();
    if (birdsDead === POPULATION_SIZE) {
      findBestBird();
      bird = naturalSelection();
      reset();
    }
  };
});
