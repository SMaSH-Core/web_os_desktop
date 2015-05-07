'use strict';

/* App Module */

var app = angular.module('schedulerApp', [ ]);

app.controller('MainSchedulerCtrl', function($scope) {
  $scope.events = [ 
  	{ id:1, text:"Task A-12458",
      start_date: new Date(2015,5,12),
      end_date: new Date(2015,5,16) },
    { id:2, text:"Task A-83473",
      start_date: new Date(2015,5,22 ),
      end_date: new Date(2015,5,24 ) }
  ];
  $scope.scheduler = { date : new Date() };
  console.log(events);

});