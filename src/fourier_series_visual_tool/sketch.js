let nValueSlider, circleDrawStrokeSlider, timeSlider, rSlider;
let colorWave, colorFourierWave, colorCircleStrokeWave;

const fourierWavePoints = [];
const wavePoints = [];
const circlePoints = [];
const waveDrawStart = 400;
const waveDrawWidth = 350;
let t = 0.0;
let waveType = 0;

function setup() {
  colorMode(RGB);
  const canvas = createCanvas(1200, 800);
  canvas.mouseClicked(OnCanvasClicked);
  nValueSlider = createSlider(1, 50, 3);
  circleDrawStrokeSlider = createSlider(1, 500, 50);
  timeSlider = createSlider(0, 1000, 200);
  rSlider = createSlider(1, 500, 250);
  nValueSlider.style("width", "200px");
  timeSlider.style("width", "200px");
  textSize(20);
  textAlign(RIGHT, BOTTOM);

  let triangleWaveBtn, sawToothWaveBtn, squareWaveBtn;
  triangleWaveBtn = createButton("Triangle Wave");
  sawToothWaveBtn = createButton("Sawtooth Wave");
  squareWaveBtn = createButton("Square Wave");
  triangleWaveBtn.mouseClicked(() => {
    waveType = 0;
  });
  sawToothWaveBtn.mouseClicked(() => {
    waveType = 2;
  });
  squareWaveBtn.mouseClicked(() => {
    waveType = 1;
  });

  colorWave = color(100, 200, 255, 255);
  colorFourierWave = color(255, 100, 100);
  colorCircleStrokeWave = color(180, 255, 180);
}

function draw() {
  background(20);
  showFrameRate();

  stroke(255);
  noFill();
  strokeWeight(2);

  // draw fourier wave in polar coordinate system
  translate(400, 400);
  t += timeSlider.value() / 10000.0;
  let coorinateVector = createVector(0, 0);

  // fourier calculation
  for (let i = 0; i < nValueSlider.value(); i++) {
    const prevX = coorinateVector.x;
    const prevY = coorinateVector.y;

    const n = i * 2 + 1;
    const wave = getFourierWave(t, n, rSlider.value(), waveType);
    coorinateVector.add(createVector(wave.x, wave.y));

    // draw circles
    noFill();
    stroke(255, 100);
    ellipse(prevX, prevY, wave.z * 2);
    fill(255);
    line(coorinateVector.x, coorinateVector.y, prevX, prevY);
    ellipse(prevX, prevY, 6);
  }

  // draw final circle (last sum)
  noStroke();
  fill(colorFourierWave);
  ellipse(coorinateVector.x, coorinateVector.y, 8);
  stroke(colorFourierWave);
  line(coorinateVector.x, coorinateVector.y, waveDrawStart, coorinateVector.y);

  if (timeSlider.value() !== 0) {
    circlePoints.unshift(coorinateVector);
  }

  drawCircleWaveStroke();

  if (circlePoints.length > circleDrawStrokeSlider.value()) {
    circlePoints.pop();
    const diff = circlePoints.length - circleDrawStrokeSlider.value();
    circlePoints.splice(circlePoints.length - diff, diff);
  }

  // wave draw extra info
  translate(waveDrawStart, 0);

  drawDiagram();

  if (timeSlider.value() !== 0) {
    // try sawtooth wave but does not work?
    /* let _y = 0;
    for (let index = 0; index < nValueSlider.value(); index++) {
      const k = index * 2 + 1;
      _y += (pow(-1, k) / k) * sin(2.0 * PI * k * t);
    } */
    fourierWavePoints.unshift(coorinateVector.y);
    wavePoints.unshift(getWave(t, rSlider.value(), waveType));
  }

  drawWaves();

  if (fourierWavePoints.length > waveDrawWidth) {
    fourierWavePoints.pop();
    wavePoints.pop();
  }
}

const drawCircleWaveStroke = () => {
  // circle stroke v1: with closed shape
  noFill();
  stroke(colorCircleStrokeWave);
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
};

// draw functions
const drawWaves = () => {
  // wave draw
  stroke(colorWave);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i = 0; i < wavePoints.length; i++) {
    const xPos = i * 1;
    const yPos = wavePoints[i];
    vertex(0 + xPos, yPos);
  }
  endShape();

  // fourier wave draw
  stroke(colorFourierWave);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < fourierWavePoints.length; i++) {
    const xPos = i * 1;
    const yPos = fourierWavePoints[i];
    vertex(0 + xPos, yPos);
  }
  endShape();
};

const drawDiagram = () => {
  noStroke();
  fill(colorFourierWave);
  //ellipse(0, coorinateVector.y, 8);
  noFill();
  stroke(255);
  line(0, -height, 0, height);
  line(0, 0, 0 + waveDrawWidth + 10, 0);
  text(
    `n = ${nValueSlider.value()}\nspeed = ${floor(
      map(timeSlider.value(), 0, 1000, 0, 100)
    )}%\nt = ${floor(t / PI)}π`,
    -15,
    100
  );
  noStroke();
  fill(colorWave);
  text("wave", -15, -height / 2 + 20);
  fill(colorFourierWave);
  text("fourier wave", -15, -height / 2 + 36);
  fill(colorCircleStrokeWave);
  text("circle wave stroke", -15, -height / 2 + 52);
};

// wave types
const getTriangleWave = (t, n, sizeScalar) => {
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
  const _r = (sizeScalar * -2) / (n * PI); //sizeScalar * (2 / n) * (-1) ** (n + 1);
  const y = _r * cos(n * t);
  const x = _r * sin(n * t);
  return createVector(x, y, _r);
};

const getFourierWave = (t, n, sizeScalar = 1, type) => {
  switch (type) {
    case 0:
      return getTriangleWave(t, n, sizeScalar);
    case 1:
      return getSquareWave(t, n, sizeScalar);
    default:
      return getSawToothWave(t, n, sizeScalar);
  }
};

const getWave = (t, sizeScalar = 1, type) => {
  switch (type) {
    case 0:
      return (
        (4 * abs(t / (PI * 2) - floor(t / (PI * 2) + 3 / 4) + 1 / 4) - 1) *
        sizeScalar
      );
    case 1:
      return sgn(sin((2 * PI * t) / (2 * PI))) * sizeScalar; //4 * t - 2 * (2 * t) + 1, 2 * t ;
    default:
      return 2 * (t - floor(t + 1 / 2)) * sizeScalar;
    //return -((2.0 * 100) / PI) * atan(1 / tan((PI * t) / PI)) * sizeScalar;
  }
};

const sgn = (x) => {
  return x / abs(x);
};

// events
let previousTimeSliderValue = 0;
const OnCanvasClicked = () => {
  const pValue = previousTimeSliderValue;
  previousTimeSliderValue =
    previousTimeSliderValue > 0 ? 0 : timeSlider.value();
  timeSlider.value(pValue);
};
