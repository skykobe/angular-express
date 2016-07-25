var ser = angular.module('BlogComponent', []);
ser.directive('blogpaper', function() {
  return {
    restrict: 'E',
    template: '<h1>hello my blog</h1>'
  }
})
