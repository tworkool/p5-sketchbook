let CIRCLE_RADIUS;
let t = 0;
let multSlider, circlePointSlider;
const D = 600;
let multSliderValue;

function setup() {
  //createCanvas(2000, 2000);
  createCanvas(windowWidth - 20, windowHeight - 20);
  //multSlider = createSlider(2, 200, 2);
  circlePointSlider = createSlider(10, 1000, D);
  CIRCLE_RADIUS = height * 0.4;
  textAlign(CENTER, CENTER);
  textSize(100);
}

function draw() {
  background(10, 50);
  showFrameRate();
  t += 0.005;

  const circlePoints = [];
  const CIRCLE_DENSITY = circlePointSlider.value();
  //const CIRCLE_DENSITY = (10 + int(t * 20)) % 2000; //int(map(mouseY, 0, height, 10, 500));
  const CIRCLE_POINT_STEP = TWO_PI / CIRCLE_DENSITY;
  for (let i = 0; i < CIRCLE_DENSITY; i++) {
    let x = CIRCLE_RADIUS * sin(CIRCLE_POINT_STEP * i);
    let y = CIRCLE_RADIUS * cos(CIRCLE_POINT_STEP * i);
    circlePoints.push(createVector(x, y));
  }

  translate(width / 2, height / 2);

  strokeWeight(1);
  //const multSliderValue = t % 1000;
  multSliderValue = int(map(mouseX, 0, width, 2, 400)); //multSlider.value();
  const c = color(
    int(noise(multSliderValue) * 255),
    int(noise(multSliderValue + 10) * 255),
    int(noise(multSliderValue - 10) * 255)
  );
  for (let i = 0; i < CIRCLE_DENSITY; i++) {
    const posIndex1 = i % circlePoints.length;
    let pos1 = circlePoints[posIndex1];
    const posIndex2 = int(i * multSliderValue) % circlePoints.length;
    if (posIndex1 == posIndex2) {
      continue;
    }
    let pos2 = circlePoints[posIndex2];
    noFill();
    stroke(c);
    line(pos1.x, pos1.y, pos2.x, pos2.y);
  }

  stroke("white");
  noFill();
  strokeWeight(2);
  circle(0, 0, CIRCLE_RADIUS * 2);

  /* noStroke();
  const cNegative = color(255 - red(c), 255 - green(c), 255 - blue(c));
  fill(cNegative);
  text(round(multSliderValue, 2), 0, 0); */
}

function keyTyped() {
  if (key === "s") {
    saveCanvas(`mandelbrot-${multSliderValue}`, "png");
  }
}
