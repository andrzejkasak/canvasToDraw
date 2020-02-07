class Button {
  constructor(t, x, y, w, h, fun, arg) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.t = t;
    this.s = false;
    this.olds = false;
    this.f = 0;
    this.fun = fun;
    this.arg = arg;

  }

  setFunc(f, arg) {
    if (this.clicked() && this.f == 0) {
      if (!arg) f();
      else f(arg);
      this.f = 1;
    }
    if (!this.clicked() && this.f == 1) {
      this.f = 0;
    }

  }

  clicked() {
    return this.s;
  }
  setState(s) {
    this.s = s;
  }

  hovering() {
    return (mouseX > this.x && mouseY > this.y &&
      mouseX < this.x + this.w && mouseY < this.y + this.h) ? true : false;

  }

  display() {
    this.olds = this.s;
    if (mouseIsPressed) {
      if (this.hovering()) {
        this.setState(1);
      }
    } else {
      this.setState(0);
    }

    this.setFunc(this.fun, this.arg);

    stroke(0,0,100);
    let c = 20;
    fill(c + this.s * (80 - c));
    if (this.hovering() && this.s == 0) {
      fill(0,0,50);
    }
    rect(this.x, this.y, this.w, this.h);
    if (this.s) fill(0,0,0);
    else fill(0,0,100);
    noStroke();
    let textS = 10;
    if (this.h < this.w) textS = this.h / 1.5;
    else textS = this.w / 1.5;
    textSize(textS);
    textFont('Courier New');
    text(this.t, this.x + (this.w / 2 - (this.t.length) * textS / 3.3), this.y + this.h / 2 - textS / 2.1, this.w, this.h);
    textFont('Helvetica');

  }
}