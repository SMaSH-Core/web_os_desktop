var app = angular.module('myApp', ['ngRoute','ngTouch']);


app.controller("AppController", function($scope){
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}
	$scope.memo=[];
	$scope.mcount=3;
	$scope.addbutton=true;
	$scope.savebutton=false;
	$scope.increment = function() {
	    $scope.mcount+=1;
  	};
    $scope.title="";
});

app.directive('divMemo',function(){
	return {

        restrict: 'E',
        template: '<div class="memo_sec" ng-show="memo['+$scope.mcount+']"><div class="memo" ><textarea class="memo_txt" rows="10" cols="20" id="memo['+$scope.mcount+']"></textarea></div></div> '
    };
})

app.directive('add', function($compile){

    var linkFn = function(scope, element, attrs){        
        var addDiv = function(e){
            
        	angular.element(document.getElementById('memo')).append($compile('<div-memo></div-memo>')(scope));  
			$scope.memo[$scope.mcount]=true;
			$compile($scope.increment())(scope);
            scope.$apply();
        };
        element.on('click', addDiv);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});
app.directive('liMemo',function(){

	return {
        restrict: 'E',

        /*template: '<li class="memo_title" ng-click="memo['+$scope.mcount+']=!memo['+$scope.mcount+'];">'+angular.element(document.getElementById('memo['+$scope.mcount+']')).childNodes[0]+'</li>'*/
       template: '<li class="memo_title" ng-click="memo['+($scope.mcount-1)+']=!memo['+($scope.mcount-1)+'];">'+$scope.title+'</li>'
    };
})

app.directive('save', function($compile){

    var linkFn = function(scope, element, attrs){        
        var save = function(e){
        	$scope.memo=false;
            $scope.title=document.getElementById('memo['+($scope.mcount-1)+']').childNodes[0];
            angular.element(document.getElementById('memo_list')).append($compile('<li-memo></li-memo>')(scope));  
			
        };
        element.on('click', save);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});
