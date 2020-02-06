let leftPressed = false;
let reset;
let wWidth = 1000, wHeight = 600;
let socket;
let div;
let cp;
let slB;

function setup() {
  let canvas = createCanvas(wWidth, wHeight);
  canvas.position(windowWidth/2-wWidth/2, windowHeight/2-wHeight/2);
  reset = createButton("CLEAR");
  reset.position(windowWidth/2-30, 20);
  reset.mousePressed(button1Clicked);
  colorMode(HSB, 100);
  cp = new ColorPicker(20,40,128,128);
  slB = new Slider(20, 200, 15, 128, 1, 100);
  clearCanvas();
  
  div = createDiv('count').size(100, 100);
  
  socket = io.connect('192.168.1.4:3000');
  socket.on('data', drawData);
  socket.on('clear', clearCanvas);
  socket.on('count', getOnline);
}

function draw() {
	if(mouseIsPressed){
		if(mouseButton === LEFT) leftPressed = true;
	}else{
		if(mouseButton === LEFT) leftPressed = false;
	}
    if(leftPressed) {
		let data = {
			px:	pmouseX,
			py:	pmouseY, 
			x: 	mouseX, 
			y:	mouseY,
			h:	cp.color.h, 
			s:	cp.color.s, 
			b:	cp.color.b,
			bd: slB.value
		}
	
		drawData(data);
		socket.emit('data', data); //przesyłanie danych do serwera
	}
	


	stroke(100);
	strokeWeight(1);
	fill(0);
	rect(0, 0, 168, wHeight);
	cp.draw();
	slB.display();
}

function drawData(data){
	stroke(data.h, data.s, data.b);
	strokeWeight(data.bd);
	line(data.px, data.py, data.x, data.y);
}

function clearCanvas(){
	background(0,0,100);
}

function getOnline(online){
	div.html('ONLINE: ' + online.toString());
}

function button1Clicked(){
	clearCanvas();
	socket.emit('clear');
}

