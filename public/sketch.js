let canvas;
let leftPressed = false;
let wWidth = 1200, wHeight = 600;
let socket;
let div;
let cp;
let slB;
let barWidth = 232;
let clrButton, rubButton, brshButton, bcktButton;
let usrIds;
let clrReq = false;
let tool = 1;
let myId;
let drawing = true;
let inp;

function setup() {
  canvas = createCanvas(wWidth, wHeight);
  
  //inp = createInput();
  
  clrButton = new Button("CLEAR", 
  barWidth/2 - 50, barWidth+130, 100, 40, clearClicked);
  colorMode(HSB, 100);
  
  brshButton = new Button("", 
  20, barWidth+60, 60, 60, brushClicked);
  rubButton = new Button("R", 
  86, barWidth+60, 60, 60, rubberClicked);
  bcktButton = new Button("B", 
  152, barWidth+60, 60, 60, bucketClicked);
  
  cp = new ColorPicker(20,40,barWidth-40,barWidth-40);
  slB = new Slider(20, barWidth+42, 25, barWidth-40, 1, 50, 5);
  clearCanvas();
  
  socket = io.connect('localhost:3000');
  socket.on('data', drawData);
  socket.on('clear', clearCanvas);
  socket.on('count', getOnline);
}

function draw() {
	canvas.position(windowWidth/2-wWidth/2, windowHeight/2-wHeight/2);
	if(!drawing){
		inp.position(windowWidth/2-20, windowHeight/2-18);
		inp.size(200, 30);
		textSize(30);
		noStroke();
		fill(100);
		text('USERNAME: ', wWidth/2-200, wHeight/2-15, 200, 20);
	}else{
	
	if(mouseIsPressed){
		if(mouseButton === LEFT) leftPressed = true;
	}else{
		if(mouseButton === LEFT) leftPressed = false;
	}
	
	if(inBounds()){
    if(leftPressed) {
		if(!(pmouseX == mouseX && pmouseY == mouseY)){
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
		if(tool == 1 || tool == 2){
		drawData(data);
		socket.emit('data', data); //przesyłanie danych do serwera
		}
		}
	}
	}

	if(clrReq){
		clearCanvas();
		clrReq = false;
	}

	stroke(100);
	strokeWeight(1);
	fill(0);
	rect(wWidth-barWidth, 0, barWidth, wHeight);
	rect(0, 0, barWidth, wHeight);
	
	fill(100);
	
	cp.draw();
	slB.display();
	brshButton.display();
	rubButton.display();
	bcktButton.display();
	clrButton.display();
	fill(100);
	noStroke();
	ellipse(50, barWidth+90, slB.value, slB.value)
	
	textSize(12);
	noStroke();
	fill(100);
	if(usrIds != null){
	text('ONLINE: ' + usrIds.length.toString()+' user(s)', wWidth - barWidth + 20,
	20, 200, 20);
	
	for(let i = 0; i < usrIds.length; i++){
		if(myId == usrIds[i]){
			fill(30,100,100);
		}
		else {
			fill(100);
		}
		text( 'USER '+(i+1).toString()+': '+usrIds[i], 
		wWidth - barWidth + 20, (i+2)*20, 300, 20);
	}
	}
	
	
	
	}
}

function inBounds(){
	return mouseX > barWidth && mouseX < wWidth - barWidth &&
	mouseY > 0 && mouseY < wHeight;
}

function drawData(data){
	if(drawing){
	stroke(data.h, data.s, data.b);
	strokeWeight(data.bd);
	line(data.px, data.py, data.x, data.y);
	}
}

function clearCanvas(){
	if(drawing){
	background(0,0,100);
	}
}

let flag = true;
function getOnline(ids){
	if(flag) {
		myId = ids[ids.length-1];
		flag = false;
	}
	usrIds = ids;
}

function clearClicked(){
	clrReq = true;
	socket.emit('clear');
}

let oldX, oldY;

function brushClicked(){
	if(tool!=1){
	tool = 1;
	if(oldX != null && oldY != null){
	cp.cpos.x = oldX;
	cp.cpos.y = oldY;
	}
	}
}

function rubberClicked(){
	if(tool!=2){
	oldX = cp.cpos.x;
	oldY = cp.cpos.y;
	cp.cpos.x = barWidth-40;
	cp.cpos.y = 0;
	tool = 2;
	}
}
	
function bucketClicked(){
	if(tool!=3){
	tool = 3;
	}
}