'use strict';

/* App Module */

var app = angular.module('schedulerApp', [ ]);

app.controller('MainSchedulerCtrl', function($scope) {
  $scope.events = [];

  $scope.scheduler = { date : new Date() };

});