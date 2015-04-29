var app = angular.module("app",['ngRoute','ngTouch']);

app.controller("AppController", function($scope){
	$scope.hideurl=true;
	$scope.inputurl=true;
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
	$scope.showmenu=($scope.showmenu) ? false : true;
	}

});

app.directive('addurll',function($compile){
	var addurl = function(scope,element,attrs){
		var showw = function(e){
			e.stopPropagation();
    		// stop default action of link
    		e.preventDefault();
			scope.hideurl = false;
			scope.$apply();
		};
		element.on('click',showw);
		element.on('touchend',showw);
	};
	return{
		restrict : 'C',
		link: addurl
	}
});

app.directive('adddd',function($compile){
	var urlbtn = function(scope,element,attrs){

		var adda = function(e){
			var value = document.getElementById("slurl").value;

			if(value != "" && value != null){
				if(value.search("http://") == -1){
					value = "http://"+value;
				}
				//alert(element);
				//alert(element.parent);
				var imgurl = 'http://www.google.com/s2/favicons?domain='+value;
				angular.element(document.getElementById('apps')).append($compile("<a  href ='"+value+"' target = '_blank' id = "+imgurl+" ><img src = "+imgurl+" id = "+imgurl+" class = 'tosave' draggable/></a>")(scope));
				scope.hideurl = true;
			}
			else{
				alert("잘못 입력하셨습니다.");
				scope.hideurl = true;
			}
		}
		element.on('click',adda);
	};
	return{
		restrict : 'C',
		link: urlbtn
	}
});

app.directive('in',function(){
	var addurl = function(scope,element,attrs){
		var prevent = function(e){
			e.stopPropagation();
    		//e.preventDefault();
		};
		element.on('click',prevent);
	};
	return{
		restrict : 'C',
		link: addurl
	}
});


