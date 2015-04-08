var app = angular.module('myApp', ['ngRoute','ngTouch']);

app.directive('mySlideController', ['$swipe',function($swipe) {
	return {
		restrict: 'EA',
		link: function(scope, element, attrs, ctrl) {
			var startX, pointX;
			$swipe.bind(element, {
				'start': function(coords) {
					startX = coords.x;
					pointX = coords.y;
				},
				'move': function(coords) {
					var delta = coords.x - pointX;
					// ...
				},
				'end': function(coords) {
				// ...
				},
				'cancel': function(coords) {
				// ...
				}
			});
		}
	}
}]);

app.controller("AppController", function($scope){
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}
});

