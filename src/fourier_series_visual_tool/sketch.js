let nValueSlider, circleDrawStrokeSlider, timeSlider, rSlider;
function setup() {
  const canvas = createCanvas(1200, 800);
  canvas.mouseClicked(OnCanvasClicked);
  nValueSlider = createSlider(1, 50, 3);
  circleDrawStrokeSlider = createSlider(1, 500, 50);
  timeSlider = createSlider(0, 3000, 1000);
  rSlider = createSlider(1, 500, 100);
  nValueSlider.style("width", "200px");
  timeSlider.style("width", "200px");
  textSize(20);
  textAlign(RIGHT, BOTTOM);

  let sawWaveBtn, squareWaveBtn;
  sawWaveBtn = createButton("Saw Wave");
  squareWaveBtn = createButton("Square Wave");
  sawWaveBtn.mouseClicked(OnSawWaveBtnClicked);
  squareWaveBtn.mouseClicked(OnSquareWaveBtnClicked);
}

const wavePoints = [];
const circlePoints = [];
const waveDrawStart = 500;
const waveDrawWidth = 250;
let t = 0.0;
let waveType = 0;

function draw() {
  background(20);

  stroke(255);
  noFill();
  strokeWeight(2);

  // circles draw
  translate(400, 400);
  t += timeSlider.value() / 10000.0;
  let coorinateVector = createVector(0, 0);
  for (let i = 0; i < nValueSlider.value(); i++) {
    const prevX = coorinateVector.x;
    const prevY = coorinateVector.y;

    const n = i * 2 + 1;
    const wave = getWave(t, n, rSlider.value(), waveType);
    coorinateVector.add(createVector(wave.x, wave.y));
    noFill();
    stroke(255, 100);
    ellipse(prevX, prevY, wave.z * 2);
    fill(255);
    line(coorinateVector.x, coorinateVector.y, prevX, prevY);
    ellipse(prevX, prevY, 6);
  }
  noStroke();
  fill(255, 180, 180);
  ellipse(coorinateVector.x, coorinateVector.y, 8);
  stroke(255, 180, 180);
  line(coorinateVector.x, coorinateVector.y, waveDrawStart, coorinateVector.y);

  if (timeSlider.value() !== 0) {
    circlePoints.unshift(coorinateVector);
  }

  // circle stroke v1: with closed shape
  noFill();
  stroke(180, 255, 180);
  beginShape();
  for (let i = 0; i < circlePoints.length; i++) {
    vertex(0 + circlePoints[i].x, circlePoints[i].y);
  }
  endShape();

  // circle stroke v2: with points
  /* noStroke();
  for (let i = 0; i < circlePoints.length; i++) {
    fill(180, 255, 180, 255 - (255.0 / circleDrawStrokeSlider.value()) * i);
    ellipse(0 + circlePoints[i].x, circlePoints[i].y, 3);
  } */

  if (circlePoints.length > circleDrawStrokeSlider.value()) {
    circlePoints.pop();
    const diff = circlePoints.length - circleDrawStrokeSlider.value();
    circlePoints.splice(circlePoints.length - diff, diff);
  }

  // wave draw extra info
  translate(waveDrawStart, 0);
  noStroke();
  fill(255, 180, 180);
  ellipse(0, coorinateVector.y, 8);
  noFill();
  stroke(255);
  line(0, -height, 0, height);
  line(0, 0, 0 + waveDrawWidth + 10, 0);
  text(
    `n = ${nValueSlider.value()}\nspeed = ${floor(
      map(timeSlider.value(), 0, 5000, 0, 100)
    )}%`,
    -15,
    100
  );

  if (timeSlider.value() !== 0) {
    wavePoints.unshift(coorinateVector.y);
  }

  stroke(255, 180, 180);
  noFill();

  // wave draw
  beginShape();
  for (let i = 0; i < wavePoints.length; i++) {
    const xPos = i * 1;
    const yPos = wavePoints[i];
    vertex(0 + xPos, yPos);
  }
  endShape();

  if (wavePoints.length > waveDrawWidth) {
    wavePoints.pop();
  }
}

// wave types
const getSawWave = (t, n, sizeScalar) => {
  const _r = sizeScalar * ((8 / PI ** 2) * ((-1) ** ((n - 1) / 2) / n ** 2));
  const x = _r * cos(n * t);
  const y = _r * sin(n * t);
  return createVector(x, y, _r);
};

const getSquareWave = (t, n, sizeScalar) => {
  const _r = sizeScalar * (4 / (n * PI));
  const x = _r * cos(n * t);
  const y = _r * sin(n * t);
  return createVector(x, y, _r);
};

const getSawToothWave = (t, n, sizeScalar) => {
  const _r = sizeScalar * ((2 / (PI * n)) * (-1) ** n);
  const x = _r * cos(n * t);
  const y = _r * sin(n * t);
  return createVector(x, y, _r);
};

const getWave = (t, n, sizeScalar = 1, type) => {
  switch (type) {
    case 0:
      return getSawWave(t, n, sizeScalar);
    case 1:
      return getSquareWave(t, n, sizeScalar);
    default:
      return getSawToothWave(t, n, sizeScalar);
  }
};

// events
let previousTimeSliderValue = 0;
const OnCanvasClicked = () => {
  const pValue = previousTimeSliderValue;
  previousTimeSliderValue =
    previousTimeSliderValue > 0 ? 0 : timeSlider.value();
  timeSlider.value(pValue);
};

const OnSawWaveBtnClicked = () => {
  waveType = 0;
};

const OnSquareWaveBtnClicked = () => {
  waveType = 1;
};
