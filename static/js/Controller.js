var ctl = angular.module('ctl', ['Services']);
var user = '';
var head = '';
var x = [];
ctl.controller('LogSign', ['$scope', '$http', 'checkRem', function($scope, $http, checkRem) {
	var r = checkRem.result();
	$scope.UserName = r.username;
	$scope.PassWord = r.pass;
	if($scope.UserName && $scope.PassWord) {
		$('#checknote').prop('checked', true);
	}
	$scope.warm_name = '';
	$scope.warm_pass = '';
	$scope.sign_name = '';
	$scope.sign_pass = '';
	$scope.sign_nick = '';
	$scope.CancleSign = function() {
		$('#signModel').modal('hide');
	}
	$scope.GoSign = function () {
		var name = $("#SignName").val();
		var password = $('#SignPassword').val();
		var nickname = $('#Nickname').val();
		if(!name) {
			$scope.sign_name = 'Please input user name'
			$scope.sign_pass = '';
			$scope.sign_nick = '';
		} else if(!password) {
			$scope.sign_name = '';
			$scope.sign_pass = 'Please input the password';
			$scope.sign_nick = '';
		} else if(!nickname) {
			$scope.sign_name = '';
			$scope.sign_pass = '';
			$scope.sign_nick = 'Please input your nickname';
		} else {
			$http({
				url: '/Gosign',
				method: 'post',
				data: {
					name: name,
					password: password,
					nickname: nickname
				}
			}).success(function (data, status, header, config) {
				alert('now is success to sign up!');
				$('#signModel').modal('hide');
			})
		}
	};
	$scope.LogIn = function() {
		var name = $scope.UserName;
		var pass = $scope.PassWord;
		if(!name) {
			$scope.warm_name = 'Please input user name';
			$scope.warm_pass = '';
		} else if(!pass) {
			$scope.warm_pass = 'Please input the password';
			$scope.warm_name = '';
		} else {
			$http({
				url: '/GoLog',
				method: 'post',
				data: {
					name: $scope.UserName,
					password: $scope.PassWord
				}
			}).success(function(data, status, header, config) {
				if(data.log) {
					alert('Success to Log in');
					user = data.user;
					head = '/images/userHead/' + data.head
					if($('#checknote').prop('checked')) {
						localStorage.RemenberUser = name;
						localStorage.RemenberPass = pass;
					} else {
						localStorage.RemenberUser = '';
						localStorage.RemenberPass = '';
					};
					location.hash = '/MainPage/wordWell';
				} else {
					$scope.warm_name = data.msg_name;
					$scope.warm_pass = data.msg_pass;
				}
			})
		}

	};
	$scope.showModal = function () {
		$('#signModel').modal('show')
			.on('hidden.bs.modal', function (e) {
				$("#SignName").val('');
				$('#SignPassword').val('');
				$('#Nickname').val('');
				$scope.sign_name = '';
				$scope.sign_pass = '';
				$scope.sign_nick = '';
			})
	};
}])
ctl.controller('Main', ['$scope', '$http', '$interval', '$location', '$interval', 'checkLog', function($scope, $http, $interval, $location, $interval, checkLog) {
		$scope.CheckLog = checkLog.check(user);
		if(localStorage.RemenberPass && localStorage.RemenberUser) {
			$http({
				url: '/GetNickname',
				method: 'POST',
				data: {
					userName: localStorage.RemenberUser
				}
			}).success(function(data) {
				$scope.user_nickname = data[0]
				$scope.userHead = '/images/userHead/' + data[1]
			})
		} else {
			$scope.user_nickname = user
			$scope.userHead = head
		}
		$scope.Message;
		$('#datetimepicker').datetimepicker();
		$scope.getMsg = function () {
			$("#MsgPanel").css('display', 'none')
			$("#MsgPanel").fadeIn(1000);
			$scope.Message = []; //在第二次调用的时候除去原本的数据，以免重复push相同的内容
			$http({
				url: '/getMsg',
				method: 'GET',
			}).success(function (data, status, header, config) {
				$scope.Message = data;
			})
		};
		$scope.getMsg();
		$scope.toBlog = function () {
			setTimeout(function (argument) {
				location.hash = '/MainPage/MyBlog';
			}, 1300);
			$scope.lfade = true;
			$scope.rfade = true
		}
		$scope.Createplan = function() {
			$http({
				url: '/SaveMyplan',
				method: 'POST',
				data: {
					time: $('#datetimepicker').val(),
					place: $scope.planPlace,
					content: $scope.planContent,
					user: $scope.user_nickname
				}
			}).success(function (data, status, header, config) {
				$scope.planTime = ''
				$scope.planPlace = ''
				$scope.planContent = ''
				$scope.getMsg();
			})
		}
		$scope.hideCollapse = function() {
			$('#Newplan').collapse('hide')
		}
		$scope.newHead = function() {

		}
		$scope.exit = function() {
			$http({
				url: '/Exit',
				method: 'GET',
			}).success(function(data, status) {
				if(data) {
					location.hash = 'logsign';
					$('#userSet').modal('hide')
				}
			})
		}
		$scope.changeHead = 'none'    // 点击newhead出现相应面板
		$scope.userNewHead = ''
		$scope.seeNewHead = 'disabled' // 使浏览的按钮可按
		$scope.headLook = 'none'
		var loop
		$scope.newHead = function() {
			$scope.changeHead = $scope.changeHead == 'block'? 'none' : 'block'
		}
		$scope.submitHead = function() {
			$scope.seeNewHead = ''
		}
		$scope.loopGetNewHead = function() {
			if($scope.userHead != $scope.userNewHead) {
				$http({
					url: '/getNewHead', 
					method: 'POST',
					data: {
						nickname: $scope.user_nickname
					}
				}).success(function(data) {
					$scope.userNewHead = '/images/userHead/' + data
				})
			} else {
				$interval.cancel(loop)
				loop = undefined;
			}

		}
		$scope.preSeeHead = function() {
			$scope.headLook = '';
			loop = $interval($scope.loopGetNewHead, 1000);
		}
		$scope.sureHead = function() {
			$http({
				url: '/getNewHead',
				method: 'POST',
				data: {
					nickname: $scope.user_nickname
				}
			}).success(function(data) {
				$scope.userHead = '/images/userHead/' + data
			})
		}
}]);

ctl.controller('BLOG', ['$scope', '$http', 'MarkdownIn', function ($scope, $http, MarkdownIn) {
	MarkdownIn.In();
	$scope.userPhoto = 'images/fav.jpg';
	$scope.userName = user;
	$scope.MouseIn = function() {
		var color_1 = parseInt(Math.random()*16).toString(16);
		var color_2 = parseInt(Math.random()*16).toString(16);
		var color_3 = parseInt(Math.random()*16).toString(16);
		var color_4 = parseInt(Math.random()*16).toString(16);
		var color_5 = parseInt(Math.random()*16).toString(16);
		var color_6 = parseInt(Math.random()*16).toString(16);
		var C1 = parseInt((color_1+color_2),16)
		var C2 = parseInt((color_3+color_4),16)
		var C3 = parseInt((color_5+color_6),16)
		$scope.BgColor = {'background-color': 'rgba('+C1+','+C2+','+C3+',0.5)'}
	}
}])
