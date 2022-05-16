const showFrameRate = () => {
  textAlign(RIGHT, TOP);
  textSize(16);
  const fr = round(frameRate());
  stroke(255);
  strokeWeight(1);
  if (fr >= 60) fill(20, 250, 20);
  else if (fr >= 30 && fr < 60) fill(200, 50, 40);
  else fill(250, 20, 20);
  text(fr, width - 5, 5);
};

const getRandomArrayItem = (arr) => {
  const i = floor(random(arr.length));
  return arr[i];
};
