setup = (_) => {
  createCanvas((W = windowWidth), (H = windowHeight));
  colorMode(HSB, 8);
  h = random(9);
  P = [color(h, 3, 1), color(h, 4, 2), color(h, 3, 4), color(h, 2, 6), color(h, 1, 8)];
  T = 0;
  A = random(1);
  B = random(1);
};
draw = (_) => {
  T += 0.001;
  background(P[2]);
  for (let i = 50; i >= 0; i--) {
    stroke(P[i % 5]);
    x = W * noise(i * A + B * sin(A * W * i + B * T + A) ** 3);
    y = H * noise(i * i * A - A * T + B * sin(B * W * i + B * T) ** 3);
    z = i / 50;
    strokeWeight(z * y);
    line(x, 0, x, H);
    strokeWeight(z * x);
    line(0, y, W, y);
  }
};
