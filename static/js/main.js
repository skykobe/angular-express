var app = angular.module('MyApp', ['ngRoute', 'ctl', 'Directive']);
app.config(function($routeProvider) {
	$routeProvider.when('/logsign', {
		templateUrl: 'template/LogSign.html',
		controller: 'LogSign'
	}).when('/MainPage/wordWell', {
		templateUrl: 'template/MAIN.html',
		controller: 'Main'
	}).when('/MainPage/MyBlog', {
		 templateUrl: 'template/blog.html',
		 controller: 'BLOG'
	})
});