var app = angular.module('myApp', ['ngRoute','ngTouch']);


app.controller("AppController", function($scope){
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}
});
