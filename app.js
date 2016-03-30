var express = require('express');
var bodyParse = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var log = false;
var contentNum;
var num = 0;

var connect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'angular-express'
});
connect.connect();

app.use(express.static('static'));
app.use(bodyParse());
app.use(bodyParse.json());

//app.get('/', function (req, res) {
//	res.redirect('/index');
//});
app.get('/index', function (req, res) {
	res.sendFile('index.html', {root: 'static'});
});
app.get('/getMsg', function (req, res) {
		/*      文件系统    */
		// fs.readFile('data/Msg.dat', function (err, data) {
		// 	res.send(JSON.parse(data));
		// })
		connect.query('SELECT * FROM maindata', function (err, result) {
			contentNum = result.length;
			num = result.length + Math.random()*10 + Math.random()*100;
			res.send(result);
		})
});
app.post('/Gosign', function (req, res) {
	var Uname = req.body.name;
	var Upass = req.body.password;
	var Nname = req.body.nickname;
	var id = Math.random()*100 + Math.random()*10;
	connect.query('INSERT INTO UserDate(id, username, password, nickname) VALUE(?,?,?,?)', [id, Uname, Upass, Nname], 
		function  (err, result) {
			if(result) {
				console.log('add the user');
				res.send(true);
			}
		})
});
app.post('/GoLog', function(req, res) {
	var Uname = req.body.name;
	var Upass = req.body.password;
	/* 文件流写法 */
	// fs.readFile('data/USER/' + Uname + '.dat', function (err, data) {
	// 	var Data ;
	// 	if(err) {
	// 		Data = {
	// 			log: false,
	// 			msg_name: 'the user is not exit!!'
	// 		}
	// 	} else {
	// 		var x = JSON.parse(data);
	// 		if(x.password == Upass) {
	// 			console.log('An user log in');
	// 			Data = {
	// 				log: true,
	// 				user: Uname
	// 			}
	// 		} else {
	// 			Data = {
	// 				log: false,
	// 				msg_pass: 'error for password'
	// 			}
	// 		}
	// 	}
		connect.query('SELECT * FROM UserDate where username=?',Uname, 
			function  (err, result) {
				if(result[0]) {
					var log = result[0].password == Upass ? true : false
					res.send({
						log: log,
	 				    user: result[0].nickname,
	 				    msg_pass: 'error for password'
					});
				} else {
					res.send({
						log: false,
						msg_name: 'the user is not exit!!'
					});
				}
			})
})
app.post('/SaveMySpeaking', function(req, res) {
		var data = new Date();
		var time = data.getFullYear() + ' / ' + (data.getMonth()+1) + ' / ' + data.getDate() + ' --- ' + data.getHours() + ' : ' + data.getMinutes();
		var content = req.body.content;
		var user = req.body.user;
		num = contentNum + Math.random()*10 + Math.random()*100;
		/*         文件流写法                */
		// var info;
		// fs.readFile('data/Msg.dat', function (err, data) {
		// 	info = JSON.parse(data);
		// 	info.time.push(time);
		// 	info.content.push(content);
		// 	info.user.push(user);
		// 	fs.writeFile('data/Msg.dat', JSON.stringify(info) ,function (err, data) {

		// 	})
		// });
		connect.query('INSERT INTO MainData(num, nickname, content, time) VALUE(?,?,?,?)', [num, user, content, time], 
		function  (err, result) {
			if(err) {
				console.log(err)
			} else {
				console.log('new a date')
			}
		});
		//connect.release();
		res.send(true);
});

app.listen('3000', function () {
	console.log('service is running in port 3000');
})