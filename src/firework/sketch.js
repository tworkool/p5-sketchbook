let timeStep = 0.015;
let time = 0;
const g = 9.81 / 4;
let bg;
const colorPaletteRed = [
  "#ff7034",
  "#ff3503",
  "#ba160c",
  "#dd4400",
  "#ff6f52",
  "#ffcf00",
  "#b4262a",
  "#ffa000",
  "#d73c26",
];
const colorPaletteBlue = [
  "#007bbb",
  "#007fff",
  "#00b191",
  "#030aa7",
  "#06c2ac",
  "#43628b",
  "#50c87c",
  "#53fca1",
  "#7f3e98",
];
const colorPaletteGreen = [
  "#23FA3D",
  "#45DE1F",
  "#9CF52E",
  "#41DE2F",
  "#8EFA35",
  "#40F563",
  "#2FDE83",
  "#35FACC",
];
const colorPalettes = [colorPaletteRed, colorPaletteBlue, colorPaletteGreen];
const particleSystemList = [];

function preload() {
  bg = loadImage("assets/bg2.jpg");
}

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  frameRate(30);
}

function draw() {
  background(bg, 150);
  //background(30, 150);
  //filter(GRAY);
  showFrameRate();

  time += timeStep;

  if (particleSystemList.length <= 5) {
    particleSystemList.push(
      new Firework(
        createVector(random(width), height - 20),
        createVector(0, random(-6, -12))
      )
    );
  }

  for (let i = 0; i < particleSystemList.length; i++) {
    const ps = particleSystemList[i];
    if (ps.isDormant()) {
      particleSystemList.splice(i, 1);
    }
    ps.update();
  }
}

let pMouseDragTime = 0;
function mouseClicked() {
  if (time - 2 * timeStep < pMouseDragTime || particleSystemList.length > 20) {
    return;
  }
  particleSystemList.push(
    new Firework(
      createVector(mouseX, height - 20),
      createVector(0, random(-6, -12))
    )
  );
  pMouseDragTime = time;
}
