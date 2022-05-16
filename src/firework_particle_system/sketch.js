let timeStep = 0.01;
let time = 0;
const g = 9.81;
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

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
}

function draw() {
  background(20, 150);
  showFrameRate();

  time += timeStep;

  for (let i = 0; i < particleSystemList.length; i++) {
    const ps = particleSystemList[i];
    if (ps.isDormant()) {
      particleSystemList.splice(i, 1);
    }
    ps.update();
  }
}

let pMouseDragTime = 0;
function mouseDragged() {
  if (time - 2 * timeStep < pMouseDragTime || particleSystemList.length > 20) {
    return;
  }
  particleSystemList.push(
    new ParticleSystem(
      (lifetime = 200),
      (num = random(50, 200)),
      (colorPalette = getRandomArrayItem(colorPalettes)),
      (size = 10),
      (sizeVarianceFactor = 1),
      (lifetimeVarianceFactor = 1),
      (posititon = createVector(mouseX, mouseY))
    )
  );
  pMouseDragTime = time;
}
