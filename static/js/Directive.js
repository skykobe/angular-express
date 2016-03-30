var dir = angular.module('Directive', []); //感觉我在用directive进行开发的组件化
dir.directive('header', function() {
	return {
		restrict: 'E',
		template: '<div class="page-header"><h2>Go to say something to <small>yourself</small></h2></div>'
	}
});
dir.directive('headerblog', function () { // 草，不支持大写，，不太好吧，，，，
	return {
		restrict: 'E',
		template: '<div class="page-header"><h2>Go to write something in this <small>blog</small></h2></div>'
	}
})
dir.directive('bloginfo', function () {
	return {
		restrict: 'E',
		template: '<div class="caption">'
				  + '<ul><li style="font-size: 20px"><span ng-bind="userName"></span></li>' 				
 			 	  +	'<li>paper: <span ng-bind="paperNum"></span></li></ul></div>'
	}
})