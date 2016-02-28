var express = require('express');
var bodyParse = require('body-parser');
var fs = require('fs');
var app = express();
var log = false;

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
		fs.readFile('data/Msg.dat', function (err, data) {
			res.send(JSON.parse(data));
		})
});
app.post('/Gosign', function (req, res) {
	var Uname = req.body.name;
	var Upass = req.body.password;
	var Nname = req.body.nickname;
	var data = {
		name: Uname,
		password: Upass,
		nickname: Nname
	};
	fs.appendFile('data/USER/' + Uname + '.dat', JSON.stringify(data), function(err) {

	});
	console.log('add the user');
	res.send(true);
});
app.post('/GoLog', function(req, res) {
	var Uname = req.body.name;
	var Upass = req.body.password;
	fs.readFile('data/USER/' + Uname + '.dat', function (err, data) {
		var Data ;
		if(err) {
			Data = {
				log: false,
				msg_name: 'the user is not exit!!'
			}
		} else {
			var x = JSON.parse(data);
			if(x.password == Upass) {
				console.log('An user log in');
				Data = {
					log: true,
					user: Uname
				}
			} else {
				Data = {
					log: false,
					msg_pass: 'error for password'
				}
			}
		}
		res.send(Data);
	})
})
app.post('/SaveMySpeaking', function(req, res) {
		var data = new Date();
		var time = data.getFullYear() + ' / ' + (data.getMonth()+1) + ' / ' + data.getDate() + ' --- ' + data.getHours() + ' : ' + data.getMinutes();
		var content = req.body.content;
		var user = req.body.user;
		var info;
		fs.readFile('data/Msg.dat', function (err, data) {
			info = JSON.parse(data);
			info.time.push(time);
			info.content.push(content);
			info.user.push(user);
			fs.writeFile('data/Msg.dat', JSON.stringify(info) ,function (err, data) {

			})
		});

//		fs.appendFile('data/Msg.dat', JSON.stringify(info), function (err) {
//
//		});
		res.send(true);
});

app.listen('3000', function () {
	console.log('service is running in port 3000');
})