var app = angular.module('myApp', ['ngRoute','ngTouch']);


app.controller("AppController", function($scope){
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}
});

app.directive('ngDraggable', function($document, $window){
  
  function makeDraggable(scope, element, attr) {
    //element의 위치
    var startX = element.prop('offsetLeft');
    var startY = element.prop('offsetTop');
    var x,y;
    
    element.css({
      cursor: 'pointer',
      top: startY + 'px',
      left: startX + 'px',
      position: 'relative'
      
    });

    element.on('touchstart', mousedown);

    function mousedown(event) {

      //event.preventDefault(); 기본 이벤트를 지우는 함수

      //element와 마우스 커서의 상대 위치
      startX = event.pageX-element.prop('offsetLeft');
      startY = event.pageY-element.prop('offsetTop');
      $document.on('touchmove', mousemove);
      $document.on('touchend', mouseup);
      
    }

    function mousemove(event) {
      //이동한 위치
      y = event.pageY - startY;
      x = event.pageX - startX;
     
      element.css({
        position: 'absolute',
        top: y + 'px',
        left: x + 'px'
      });
      
    }

    function mouseup() {
      //이벤트 제거
      $document.unbind('touchmove', mousemove);
      $document.unbind('touchend', mouseup);
    }
  }

  
  return { 
    link : makeDraggable
      
  };

});
