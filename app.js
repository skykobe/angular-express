var express = require('express');
var bodyParse = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var open = require('open')
var formidable = require("formidable");
var app = express();
var usingUser, userObj;
var log = false;
var result = false;
var num = 0;
var timer

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

app.get('/', function (req, res) {
	res.redirect('/index');
});
app.get('/index', function (req, res) {
	res.sendFile('index.html', {root: 'static'});
});
app.get('/getMsg', function (req, res) {
		connect.query('SELECT * FROM maindata where user=?', usingUser, function (err, result) {
			res.send(result);
		})
});
app.post('/Gosign', function (req, res) {
	var Uname = req.body.name;
	var Upass = req.body.password;
	var Nname = req.body.nickname;
	var head = 'default-user.jpg'
	var id;
	connect.query('INSERT INTO UserDate(id, username, password, nickname, head) VALUE(?,?,?,?,?)', [id, Uname, Upass, Nname, head],
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
		connect.query('SELECT * FROM UserDate where username=?',Uname,
			function  (err, result) {
				if(result[0]) {
					var log = result[0].password == Upass ? true : false
					usingUser = result[0].nickname
					userObj = result[0]
					res.send({
						log: log,
						head: result[0].head,
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
app.post('/SaveMyplan', function(req, res) {
		var time = req.body.time
		var content = req.body.content
		var place = req.body.place
		var user = req.body.user
		var id;
		console.log(time)
		connect.query('INSERT INTO MainData(user, id, planTime, content, place) VALUE(?,?,?,?,?)', [user, id, time, content, place],
		function  (err, result) {
			if(err) {
				console.log(err)
			} else {
				console.log('new a date')
			}
		});
		res.send(true);
});
app.post('/DeletePlan', function(req,res) {

})
app.post('/pushHead', function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp" // 设置默认上传路径，防止去了系统盘造成跨区错误
  form.parse(req, function(err, fields, files) {
    console.log('fields',fields);//表单传递的input数据
    console.log('files',files);//上传文件数据
		var temp_path = files.thumbnail.path
		var target_path = './static/images/userHead/' + files.thumbnail.name
		fs.rename(temp_path, target_path, function(err) { //我草你妈，rename可以进行改名，或者文件的移动
			if (err) throw err;
			connect.query('UPDATE UserDate SET head=? where id=?', [files.thumbnail.name, userObj.id], function(err, result) {
				console.log('头像上传完成')
				result = 'true'
				res.send('ok')
			})
		})
  });
})


app.post('/getNewHead', function(req, res) {
	var nick = req.body.nickname
	connect.query('SELECT * FROM UserDate where nickname=?', nick, function(err, result) {
		console.log('成功获取新头像')
		res.send(result[0].head)
	})
})

app.post('/GetNickname', function(req,res) {
	var user = req.body.userName
	connect.query('SELECT * FROM UserDate where username=?', user, function(err, result) {
		res.send([result[0].nickname, result[0].head])
	})
})
app.get('/Exit', function(req, res) {
	usingUser = '';
	res.send(true)
})

app.listen('3000', function () {
	console.log('service is running in port 3000');
	open('http://localhost:3000/index#/logsign')
})
