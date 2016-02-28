var ctl = angular.module('ctl', []);
var user = '';
var x = [];
ctl.factory('checkLog', function () {
		return {
			check: function () {
				if(!user) {
					$('#Renew').attr('disabled', 'true');
					$('#Say').attr('disabled', 'true');
					return 'Please Log in'
				}
			}
		}
});
ctl.controller('LogSign', ['$scope', '$http', function($scope, $http) {
	$scope.warm_name = '';
	$scope.warm_pass = '';
	$scope.sign_name = '';
	$scope.sign_pass = '';
	$scope.sign_nick = '';
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
		var name = $('#UserName').val();
		var password = $('#Password').val();
		if(!name) {
			$scope.warm_name = 'Please input user name';
			$scope.warm_pass = '';
		} else if(!password) {
			$scope.warm_pass = 'Please input the password';
			$scope.warm_name = '';
		} else {
			$http({
				url: '/GoLog',
				method: 'post',
				data: {
					name: name,
					password: password
				}
			}).success(function(data, status, header, config) {
				//$scope.warm_name = data;
				if(data.log) {
					alert('Success to Log in');
					user = data.user;
					console.log(data.user);
					location.hash = '/Main';
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
ctl.controller('Main', ['$scope', '$http', 'checkLog', function($scope, $http, checkLog) {
		$scope.CheckLog = checkLog.check();
		$scope.user_nickname = user;
		$scope.Message = [];
		$scope.getMsg = function () {
			$('#MsgPanel').css('display', 'none');
			$("#MsgPanel").fadeIn();
			$scope.Message = []; //在第二次调用的时候除去原本的数据，以免重复push相同的内容
			$http({
				url: '/getMsg',
				method: 'GET'
			}).success(function (data, status, header, config) {
				for(var i = 0; i < data.time.length; i++) {
					var D = {
						time: data.time[i],
						content: data.content[i],
						user: data.user[i]
					};
					$scope.Message.push(D);
				}
			})
		};
		$scope.getMsg();
		$scope.SaveSpeaking = function () {
			$http({
				url: '/SaveMySpeaking',
				method: 'POST',
				data: {
					user: user,
					content: $('#spk_content').val()
				}
			}).success(function (data, status, header, config) {
				$('#spk_content').val('');
				$scope.getMsg();
			})
		};
}]);