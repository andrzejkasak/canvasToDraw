let canvas;
let leftPressed = false;
let wWidth = 1080, wHeight = 600;
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
let flag = true;

let getIn, getOut;

function preload(){
	getIn = loadSound('sounds/getIn.wav');
	getOut = loadSound('sounds/getOut.wav');
	
}

function setup() {
  canvas = createCanvas(wWidth, wHeight);
  colorMode(HSB, 100);
 
  //inp = createInput();
  
  clrButton = new Button("CLEAR", 
  barWidth/2 - 50, barWidth+136, 100, 40, clearClicked);
  
  
  brshButton = new Button("", 
  20, barWidth+66, 60, 60, brushClicked);
  rubButton = new Button("R", 
  86, barWidth+66, 60, 60, rubberClicked);
  bcktButton = new Button("B", 
  152, barWidth+66, 60, 60, bucketClicked);
  
  cp = new ColorPicker(20,40,barWidth-40,barWidth-40);
  slB = new Slider(20, barWidth+45, 25, barWidth-40, 6, 50, 6);
  clearCanvas();
  
  socket = io.connect();
  socket.on('data', drawData);
  socket.on('clear', clearCanvas);
  socket.on('fill', fillIn);
  socket.on('id', getId);
}



function draw() {
	socket.emit('id');
	
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
		if(mouseButton === LEFT) {
			leftPressed = false;
			flag = true;
		}
	}
	
	if(inBounds()){
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
		if(!(pmouseX == mouseX && pmouseY == mouseY)){
		if(tool == 1 || tool == 2){
			drawData(data);
			socket.emit('data', data); //przesyłanie danych do serwera
		}
		}
		
		if(tool == 3 && flag){
			flag = false;
			fillIn(data); //do poprawy funkcja
			socket.emit('fill', data); //przesyłanie danych do serwera
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
	
	
	if(tool == 1){
		brshButton.chosen = true;
		rubButton.chosen = false;
		bcktButton.chosen = false;
	}
	if(tool == 2){
		brshButton.chosen = false;
		rubButton.chosen = true;
		bcktButton.chosen = false;
	}
	if(tool == 3){
		brshButton.chosen = false;
		rubButton.chosen = false;
		bcktButton.chosen = true;
	}
	
	cp.draw();
	slB.display();
	brshButton.display();
	rubButton.display();
	bcktButton.display();
	clrButton.display();
	
	fill(100);
	noStroke();
	ellipse(50, barWidth+96, slB.value, slB.value)
	
	textSize(12);
	noStroke();
	fill(100);
	if(usrIds != null){
	text('ONLINE: ' + usrIds.length.toString()+' user(s)', 
	wWidth - barWidth + 10,10, 200, 20);
	
	for(let i = 0; i < usrIds.length; i++){
		if(myId == usrIds[i]){
			fill(30,100,100);
		}
		else {
			fill(100);
		}
		text( 'USER'+(i+1).toString()+'ID: '+usrIds[i], 
		wWidth - barWidth + 10, (i+2)*20-10, 300, 20);
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

function fillIn(d){
	let fColor = color(get(d.x, d.y));
	
	let n = 5;
	let pts = [];
	
	pts[pts.length] = createVector(d.x,d.y);
	noStroke();
	fill(d.h, d.s, d.b);
	
	//stroke(cp.color.h, cp.color.s, cp.color.b);
	for(let i = 0; i < pts.length; i++){
		//print(pts.length);
		if(pts.length > 50000) break;
		
		//point(pts[i].x, pts[i].y);
		
		if(pts[i].x >= barWidth && pts[i].y >= 0 && pts[i].x <= wWidth-barWidth && pts[i].y <= wHeight) {	
		c = color(get(pts[i].x-n,pts[i].y));
		if(c.levels[0]==fColor.levels[0] && c.levels[1]==fColor.levels[1] && c.levels[2]==fColor.levels[2]){
			//fillIn(x-10,y);
			pts[pts.length] = createVector(pts[i].x-n,pts[i].y);
			ellipse(pts[i].x-n, pts[i].y,1.4*n,1.4*n);
		}
		c = color(get(pts[i].x+n,pts[i].y));
		if(c.levels[0]==fColor.levels[0] && c.levels[1]==fColor.levels[1] && c.levels[2]==fColor.levels[2]){
			//fillIn(x+10,y);
			pts[pts.length] = createVector(pts[i].x+n,pts[i].y);
			ellipse(pts[i].x+n, pts[i].y,1.4*n,1.4*n);
		}
		c = color(get(pts[i].x,pts[i].y-n));
		if(c.levels[0]==fColor.levels[0] && c.levels[1]==fColor.levels[1] && c.levels[2]==fColor.levels[2]){
			//fillIn(x,y-10);
			pts[pts.length] = createVector(pts[i].x,pts[i].y-n);
			ellipse(pts[i].x, pts[i].y-n,1.4*n,1.4*n);
		}
		c = color(get(pts[i].x,pts[i].y+n));
		if(c.levels[0]==fColor.levels[0] && c.levels[1]==fColor.levels[1] && c.levels[2]==fColor.levels[2]){
			//fillIn(x,y+10);
			pts[pts.length] = createVector(pts[i].x,pts[i].y+n);
			ellipse(pts[i].x, pts[i].y+n,1.4*n,1.4*n);
		}
		//pts.splice(0,1);
	}
	}
	
	//delete pts;
	
}

function clearCanvas(){
	if(drawing){
	background(0,0,100);
	}
}

function getId(ids, id){
	let len = 0;
	if(usrIds != null) {
		len = usrIds.length;
	}
	
	myId = id;
	usrIds = ids;
	
	if(usrIds != null && usrIds.length > len) {
		getIn.play();
	}
	if(usrIds != null && usrIds.length < len){
		getOut.play();
	}
	
}

function clearClicked(){
	clrReq = true;
	socket.emit('clear');
}

let oldX, oldY;

function brushClicked(){
	if(tool == 2 && oldX != null && oldY != null){
	cp.cpos.x = oldX;
	cp.cpos.y = oldY;
	}
	if(tool!=1){
	tool = 1;
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
	if(tool == 2 && oldX != null && oldY != null){
	cp.cpos.x = oldX;
	cp.cpos.y = oldY;
	}
	if(tool!=3){
	tool = 3;
	
	}
}
