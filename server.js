let express = require('express'); //załączanie express do serwera
let app = express(); //wywołanie fukcji tworzącej apliakcję
let server = app.listen(process.env.PORT); //nasłuchiwanie na portie o nr 3000
app.use(express.static('public')); //hostowanie plików w folderze "public"

console.log("Server is running!");

let socket = require('socket.io'); //załączenie socket.io
let io = socket(server);  //połączenie socketa z serverem
io.sockets.on('connection', newConnection); //połączenie event

let ids = [];

function newConnection(socket){
	console.log('New connection:' + socket.id);
	//ids[ids.length] = socket.id;
	//io.sockets.emit('count', ids);
	//console.log('Online: ' + ids.length + ' instances');
	

	socket.on('data', getData);
	function getData(data) {
		console.log(data);
		socket.broadcast.emit('data', data); //roześlij do wszystkich instancji prócz własnej
		//io.sockets.emit('data', data);  // roześlij do wszystkich włącznie z własną
	}
	
	socket.on('clear', sendClear);
	function sendClear(){
		console.log('Clear send!');
		socket.broadcast.emit('clear');
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
		//io.sockets.emit('count', ids);
		//console.log('Online: ' + ids.length + ' instances');
	}
}








