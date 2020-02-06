class ColorPicker {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.siz = createVector(w, h);
    this.color = {
      h: 0,
      s: 0,
      b: 0
    }
    this.sc = 8; //gęstość, im większe tym mniejsza gestość
    this.csl = new ColorSlider(this.pos.x,this.pos.y-this.siz.y/16, this.siz.y/8, this.siz.x, 0, 100);
    
    this.cpos = createVector(0, this.siz.y);
    this.s = false;
  }

  mouseHovering() {
      return (mouseX > this.pos.x && mouseX < this.pos.x+this.siz.x &&
             mouseY > this.pos.y && mouseY < this.pos.y+this.siz.y);
  }
  
  draw() {
    if (mouseIsPressed && this.mouseHovering()) {
        this.cpos.x = mouseX - this.pos.x;
        this.cpos.y = mouseY - this.pos.y;
        this.s = true;
    }
    if(mouseIsPressed && !this.mouseHovering() && this.s){
        this.cpos.x = mouseX - this.pos.x;
        this.cpos.y = mouseY - this.pos.y;
        if(this.cpos.x < 0) this.cpos.x = 0;
        if(this.cpos.y < 0) this.cpos.y = 0;
        if(this.cpos.x > this.siz.x) this.cpos.x = this.siz.x;
        if(this.cpos.y > this.siz.y) this.cpos.y = this.siz.y;
        this.s = false;
    }
    if(!mouseIsPressed && this.s){
        this.s = false;
    }
    
    this.color.h = this.csl.fvalue;
    this.color.s = map(this.cpos.x, 0, this.siz.x, 100, 0);
    this.color.b = map(this.cpos.y, 0, this.siz.y, 100, 0);
    
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.sc);
    for (let i = 0; i < this.siz.x / this.sc; i++) {
      for (let j = 0; j < this.siz.y / this.sc; j++) {
        let mi = map(i, 0, this.siz.x / this.sc, 100, 0);
        let mj = map(j, 0, this.siz.y / this.sc, 100, 0);
        stroke(this.color.h, mi, mj);
        strokeWeight(1);
        point(i, j);
      }
    }
    pop();
    
    this.csl.display();

    
    if(this.mouseHovering()){
      strokeWeight(2); 
      stroke(0, 0, 0);
      fill(0,0,100);
      ellipse(mouseX, mouseY, 8, 8);
    }
    stroke(0, 0, 100);
    fill(this.color.h, this.color.s, this.color.b);
    rect(this.pos.x, this.pos.y+this.siz.y, this.siz.x, this.siz.y/8);
    
    strokeWeight(2); 
    stroke(0, 0, 100);
    fill(0,0,0);
    ellipse(this.cpos.x + this.pos.x, this.cpos.y + this.pos.y, 8, 8);
  }

  

}

class ColorSlider {
    constructor(x, y, d, siz, minim, maxim) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.s = 0;
        this.pos = this.x;
        this.siz = siz;
        this.minim = minim;
        this.maxim = maxim;
        this.f = 0;
        this.value = minim;
        this.fvalue = minim;
    }

    setState(s) {
        this.s = s;
    }

    hovering() {
        return (mouseX > this.x && mouseX < this.x+this.siz &&
             mouseY > this.y-this.d/2 && mouseY < this.y+this.d/2);
    }

    display() {
      
        if (mouseIsPressed && this.f == 0) {
            if (this.hovering()) {
                this.setState(1);
            }
            this.f = 1;
        }
        if (!mouseIsPressed && this.f == 1) {
            this.f = 0;
            this.setState(0);
        }
        if (mouseIsPressed && this.s){
            if (mouseX > this.x && mouseX < this.x + this.siz)
                this.pos = mouseX;
            if (mouseX < this.x) this.pos = this.x;
            if (mouseX > this.x + this.siz) this.pos = this.x + this.siz;
        }
        
        this.fvalue = map(this.pos, this.x, this.x + this.siz, this.minim, this.maxim);
		this.value = round(this.fvalue);
        
        strokeWeight(1); 
        for (let i = 0; i < this.siz; i++) {
          stroke(map(i, 0, this.siz, 0 ,100),100,100);
          line(this.x+i, this.y-this.d/2, this.x+i, this.y+this.d/2);
        }
        stroke(255);
        noFill();
        strokeWeight(2); 
        rect(this.x, this.y-this.d/2, this.siz, this.d);
        let c = 51;
        fill(c + this.s * (255 - c));
        if (this.hovering() && this.s == 0) {
                fill(100);
        }
        noFill();
        stroke(0);
        strokeWeight(2);
        line(this.pos, this.y- this.d/2, this.pos, this.y+this.d/2);
        if (this.s) fill(0);
        else fill(255);

    }
}