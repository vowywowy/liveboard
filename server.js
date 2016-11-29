//express, mysql, http, socket.io
var express = require("express");
var app = express();
var path = require('path');
var mysql = require("mysql");
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'ctf'
});
db.connect(function (err) {
	if (err) console.log(err)
});

var users = 0,
	results = [];

io.sockets.on('connection', function (socket) {
	//show connected users
	users++;
	io.sockets.emit('users', users);
	socket.on('disconnect', function () {
		users--;
		io.sockets.emit('users', users);
	});

	//query
	db.query('SELECT * FROM teams')
		.on('result', function (data) {
			results.push(data);
		})
		.on('end', function () {
			socket.emit('results', results)
		});
	results = [];
});

http.listen(3000, function () {
	console.log("Listening on 3000");
});

var ZongJi = require('zongji');
var zongji = new ZongJi({
	host: 'localhost',
	user: 'zongji',
	password: 'zongji',
});

zongji.start({
	includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows']
});

zongji.on('binlog', function (update) {
	io.sockets.emit('update', update.rows);
});
