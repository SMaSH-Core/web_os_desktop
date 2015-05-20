var app = angular.module('myApp', ['ngRoute','ngTouch']);

app.controller("AppController", function($scope){
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}
    /*
	$scope.memo=[];
	$scope.mcount=3;
	$scope.addbutton=true;
	$scope.savebutton=false;
	$scope.increment = function() {
	    $scope.mcount=$scope.mcount+1;

  	};*/
    /*$scope.title="";*/
});

app.directive('memoTitle',function(){
    var linkFn = function(scope, element, attrs){        
        var mclick = function(e){
            if(this.getAttribute('class')==='memo_title'){
                this.setAttribute('class','memo_click');
            }
        };
        element.on('click', mclick);
    };
    return {
        restrict: 'C',
        link: linkFn
    };
});
app.directive('list',function(){
    var linkFn = function(scope, element, attrs){        
        var lclick = function(e){
            var c=document.getElementsByClassName('memo_click');
            for (var i = c.length - 1; i >= 0; i--) {
                        c[i].setAttribute('class','memo_title');
                    };        
        };
        element.on('click', lclick);
    };
    return {
        restrict: 'C',
        link: linkFn
    };
});
app.directive('memo',function(){
    return {
        restrict: 'E',
        template: '<div class="memo_title"><textarea class="memo_txt" rows="10" cols="20"></textarea></div>'    
    };
})
app.directive('add', function($compile){

    var linkFn = function(scope, element, attrs){        
        var addDiv = function(e){
           
            angular.element(document.getElementById('memos')).append($compile('<memo></memo>')(scope));  
            scope.$apply();
        };
        element.on('click', addDiv);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});
/*
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
			$compile($scope.increment)(scope);
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
     /*  template: '<li class="memo_title" ng-click="memo['+($scope.mcount-1)+']=!memo['+($scope.mcount-1)+'];">asasd</li>'
    };
})

app.directive('save', function($compile){

    var linkFn = function(scope, element, attrs){        
        var save = function(e){
        	$scope.memo=false;
            /*$scope.title=document.getElementById('memo['+($scope.mcount-1)+']').childNodes[0];*/
            /*angular.element(document.getElementById('memo_list')).append($compile('<li-memo></li-memo>')(scope));  
			
        };
        element.on('click', save);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});
*/
/*
app.controller('Ctrl', function ($scope) {
  
    //열려있는 탭 배열
    $scope.activeTabs = [];
 
    //탭이 열려있는지 확인하는 함수
    $scope.isOpenTab = function (tab) {
        //선택한 탭이 activeTabs 배열에 있는지 확인
        if ($scope.activeTabs.indexOf(tab) > -1) {
            return true;
        } else {
            return false;
        }
    }
 
    //탭 열기 함수
    $scope.openTab = function (tab) {
        //탭이 열려있는지 확인
        if ($scope.isOpenTab(tab)) {
            //열려잇으면 activeTabs 배열에서 제외
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            //아니면 activeTabs 배열에 추
            $scope.activeTabs.push(tab);
        }
    }
    $scope.closeTab = function(tab){
        $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
    }

});*/


