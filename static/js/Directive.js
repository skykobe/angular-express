var dir = angular.module('Directive', []); //感觉我在用directive进行开发的组件化
dir.directive('header', function() {
	return {
		restrict: 'E',
		template: '<div class="page-header"><h2>Go to say something to your <small>friends</small></h2></div>'
	}
});
dir.directive('UserWin', function () {

})