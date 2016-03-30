var app = angular.module('MyApp', ['ngRoute', 'ctl', 'Directive']);
app.config(function($routeProvider) {
	$routeProvider.when('/logsign', {
		templateUrl: 'template/LogSign.html',
		controller: 'LogSign'
	}).when('/Main', {
		templateUrl: 'template/MAIN.html',
		controller: 'Main'
	}).when('/MyBlog', {
		 templateUrl: 'template/blog.html',
		 controller: 'BLOG'
	})
});