/*
	THESE ARE THE MYSQL VARIABLES THAT NEED TO BE MODIFIED
*/
var mysqlUser = "root", 	//put an appropriate MySQL username
	mysqlPassword = "root",	//put the password for the above user
	mysqlDatabase = "ctf",	//put the name of the database where the desired table is
	tableToMirror = "TEAMS";//put the name of the table you want displayed
/*
	END OF THE MYSQL VARIABLES THAT NEED TO BE MODIFIED
*/

//packages
var express = require("express");
var app = express();
var path = require('path');
var mysql = require("mysql");
var http = require('http').Server(app);
var io = require("socket.io")(http);

//express paths
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//mysql connection
var db = mysql.createConnection({
	host: 'localhost',
	user: mysqlUser,
	password: mysqlPassword,
	database: mysqlDatabase
});
db.connect(function (err) {
	if (err) console.log(err)
});

var users = 0,
	results = [];

io.sockets.on('connection', function (socket) {
	users++;
	io.sockets.emit('users', users);
	socket.on('disconnect', function () {
		users--;
		io.sockets.emit('users', users);
	});

	//query
	db.query('SELECT * FROM ' + tableToMirror)
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
	user: 'zongji', 	//this is the zongji user you can modify
	password: 'zongji',	//this is the zongji user's password that you can modify
});

zongji.start({
	includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows']
});

zongji.on('binlog', function (update) {
	io.sockets.emit('update', update.rows);
});
