let express = require('express'); //załączanie express do serwera
let app = express(); //wywołanie fukcji tworzącej apliakcję
let server = app.listen(process.env.PORT); //nasłuchiwanie na portie o nr 3000
app.use(express.static('public')); //hostowanie plików w folderze "public"

console.log("Server is running!");

let socket = require('socket.io'); //załączenie socket.io
let io = socket(server);  //połączenie socketa z serverem
io.sockets.on('connection', newConnection); //połączenie event

let ids = [];
let dataSeq = [];

function newConnection(socket){
	console.log('New connection:' + socket.id);
	ids[ids.length] = socket.id;
	console.log('Online: ' + ids.length + ' instances');
	
	socket.broadcast.emit('sound', 1);
	socket.emit('redraw', dataSeq);
	
	socket.on('id', getSocketId);
	function getSocketId() {
		socket.emit('id', ids, socket.id); //roześlij do własnej inst
	}

	socket.on('data', getData);
	function getData(data) {
		console.log(data);
		dataSeq[dataSeq.length] = data;
		socket.broadcast.emit('data', data); //roześlij do wszystkich instancji prócz własnej
		//io.sockets.emit('data', data);  // roześlij do wszystkich włącznie z własną
	}
	
	socket.on('clear', sendClear);
	function sendClear(){
		console.log('Clear send!');
		socket.broadcast.emit('clear');
		dataSeq = [];
	}
	
	socket.on('fill', sendFill);
	function sendFill(data){
		console.log('Fill send!');
		dataSeq[dataSeq.length] = data;
		socket.broadcast.emit('fill', data);
	}
	
	socket.on('disconnect', disconnection);
	function disconnection() {
		console.log('Disconnected:' + socket.id);
		for(let i = ids.length-1; i >= 0; i--){
			if(ids[i] == socket.id){
				ids.splice(i, 1);
				break;
			}
		}
		console.log('Online: ' + ids.length + ' instances');
		socket.broadcast.emit('sound', 2);
	}
}
