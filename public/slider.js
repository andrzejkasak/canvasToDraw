class Slider {
    constructor(x, y, d, siz, minim, maxim, start) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.s = 0;
        this.pos = this.x + map(start, minim, maxim, 0, siz);
        this.siz = siz;
        this.minim = minim;
        this.maxim = maxim;
		this.start = start;
        this.f = 0;
        this.value = minim;
        this.fvalue = minim;
    }

    setState(s) {
        this.s = s;
    }

    hovering() {
        return dist(this.pos, this.y, mouseX, mouseY) < this.d / 2 ? true : false;
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
        if (mouseIsPressed && this.s)
            if (mouseX > this.x && mouseX < this.x + this.siz)
                this.pos = mouseX;


        
        this.fvalue = map(this.pos, this.x, this.x + this.siz, this.minim, this.maxim);
		this.value = round(this.fvalue);
        
        stroke(255);
        strokeWeight(2);
        line(this.x, this.y, this.x + this.siz, this.y);
        let c = 51;
        fill(c + this.s * (255 - c));
        if (this.hovering() && this.s == 0) {
                fill(100);
        }
        ellipse(this.pos, this.y, this.d, this.d);
        if (this.s) fill(0);
        else fill(255);

    }
}