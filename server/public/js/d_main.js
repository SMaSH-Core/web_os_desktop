/* This file is the code for implementing the slide of the dock bar and the addurl.
 * It is implemented by Angular.js
 *
 *
*/
var app = angular.module("app", []);

function Ctrl($scope, $http){

	//the panel that is app bucket is closed first
	$scope.slideapps = false;
	
	//app bucket toggle
	$scope.slide = function(){
		//If the app bucket is already opened, it will be closed.
		if ($scope.slideapps){
			$scope.slideapps = false;
			$scope.slideapps = !$scope.slide;
			var dock1 = document.getElementById("dock");
			
			//It doesn't working make them class and put them in the css (ex> bottom : 0%;)
			dock1.style.bottom = "0%";
			dock1.style.transition = "all 1.0s";
			
		}
		//If the app bucket is closed, it will be opened.
		else{
			$scope.slideapps = true;
			$scope.siideapps = !$scope.slide;
			var dock2 = document.getElementById("dock");
			
			
			dock2.style.bottom = "180px";
			dock2.style.transition = "all 1.0s";
			
		}
	};
	/*
		This function is making a url that user input.
		And then, put them to the 'a' which is HTML element
		And put the favicon image to the 'img'
	*/
	$scope.slideurl = false;

	/* 시계 포맷 생략
	$scope.format = 'h:mm:ss a';*/
	/* 시계 포맷 재설정 */
	$scope.format = 'h:mm';
	
	$scope.lists = [{text:'it is example', done:false}];

	$scope.todo = function(){
		$scope.lists.push({text:$scope.todotext, done:false});
		$scope.todotext = '';
	};
	$scope.remain = function(){
		var count = 0;
		angular.forEach($scope.lists, function(list){
			count += list.done ? 0: 1;
		});
		return count;
	};
	$scope.archive = function(){
		var refresh = $scope.lists;
		$scope.lists = [];
		angular.forEach(refresh,function(list){
			if(!list.done){
				$scope.lists.push(list);
			}
		});
	};

	$scope.save = function(){           
        	var memo = [""];
			var left = [""];
			var top = [""];
			var memoOBJ = document.getElementsByTagName("textarea");
			var memoDiv = $$(".w_memo");
			for(var i = 0; i <memoOBJ.length; i ++)
			{
				memo.push(memoOBJ[i].value);
				left.push(memoDiv[i].getStyle("left"));
				top.push(memoDiv[i].getStyle("top"));
			}
		    $http({
				method: 'POST', //방식
				url: 'http://localhost:9080/widget', /* 통신할 URL */
				data: 'hhhhhhhjkjkj', //{memo: memo, left: left, top: top}, /* 파라메터로 보낼 데이터 */
				headers: {'Content-Type': 'text/plain; charset=utf-8'} //헤더
			}).success( function(data, status, headers, config){
				alert('success');
			}).error( function(data, status, headers, config){
				//alert('err');
			});
		    var panelOBJ = $$("li a");
		    var href=[""];
		    var src=[""];
		    var position=[""];
		    var img = $$('.tosave');
		  
		  	for(var i =0; i <img.length; i++)
		  	{
		  		src.push(img[i].src);
		  	}
		    for(var i = 0; i < panelOBJ.length; i++)
		    {
		    	href.push(panelOBJ[i].href);
		    	if(panelOBJ[i].parentNode.parentNode.parentNode.id=="leftdock")
		    		position.push("left");
		    	else if(panelOBJ[i].parentNode.parentNode.parentNode.id=="rightdock")
		    		position.push("right");
		    	else
		    		position.push("center");
		    }
		    alert(src);
		    alert(src[1]);
		    $http({
		    	method: 'POST',
		    	url: 'http://localhost:9080/app',
		    	data: {'href': href, 'src': "testsrc", 'position': position},
		    	headers: {'Content-Type': 'application/json; charset=utf-8'}
		    }).success( function(data, status, headers, config){
		    	alert('success');
				alert(data);
			}).error( function(data, status, headers, config){
				//alert('err2');
			});
		};
}
//-----------------------Dock Draggable-------------------------------
app.directive('draggable',function(){
	return function(scope,element){
		restrict : 'E';
		var e1 = element[0];
		e1.draggable = true;
		e1.addEventListener(
			'dragstart',function(e){
				e.dataTransfer.effectAllowed = 'move';
				//alert(this);
				e.dataTransfer.setData('Text',this.id);
				this.classList.add('drag');
				return false;
			},
			false
		);

		e1.addEventListener(
			'dragend',
			function(e){
				this.classList.remove('drag');
				return false;
			},
			false
		);
	}
});



app.directive('droppable',function(){
	return {
		scope : {},
		link : function(scope, element){
			var e1 = element[0];
			e1.addEventListener(
				'dragover',
				function(e){
					e.dataTransfer.dropEffect = 'move';
					if(e.preventDefault) e.preventDefault();
					this.classList.add('over');
					return false;
				},
				false
			);

			e1.addEventListener(
				'dragenter',
				function(e){
					this.classList.add('over');
					return false;
				},false
			);
			e1.addEventListener(
				'dragleave',
				function(e){
					this.classList.remove('over');
					return false;
				},
				false
			);
			e1.addEventListener(
				'drop',function(e){
					if(e.stopPropagation) e.stopPropagation();
					//alert(e.dataTransfer.getData('Text'));
					this.classList.remove('over');
					var item = document.getElementById(e.dataTransfer.getData('Text'));
					//alert(e.dataTransfer.getData('Text'));

					if(this.id == "trash"){

						item.parentNode.removeChild(item);
					}
					else{

						if(this.id == "leftdock" || this.id == "rightdock"){
							var list = item.parentNode;
							var li = document.createElement('li');

							li.appendChild(item);
							document.getElementById(this.id+"list").appendChild(li);
							//alert(item.parentNode.id);
							list.parentNode.removeChild(list);

						}
						else{
							var li = document.createElement("li");
							li.appendChild(item);
							this.appendChild(li);
							//this.appendChild(item);
						}
					}

					return false;
				},
				false
			);
		}

		
	}
});



app.directive('addurll',function($compile){
	var addurl = function(scope,element,attrs){
		var addli = function(e){
			if(scope.slideurl == true){
				var addurl2 = document.getElementById("slurl").value;
				if(addurl2 != "" && addurl2 != null){
					if(addurl2.search("http://") == -1){
						addurl2 = "http://" + addurl2;
					}
					var imgurl = 'http://www.google.com/s2/favicons?domain='+addurl2;
					angular.element(document.getElementById('panelul')).append($compile("<li><a  href ='"+addurl2+"' target = '_blank' id = "+imgurl+" ><img src = "+imgurl+" id = "+imgurl+" class = 'tosave' draggable/></a></li>")(scope));
					scope.slideurl = false;
				}else{
					alert("잘못 입력함");
					scope.slideurl = false;
				}
			}
			//scope.urlbtn = true;
			//scope.slideurl = false;
			else{
				scope.slideurl = true;
			}
			//scope.urlbtn = true;
			scope.$apply();
			
		};
		element.on('click', addli);
	};
	return{
		restrict : 'C',
		link : addurl
	}

});

app.controller('DragDropCtrl',function($scope){
	$scope.handleDrop = function(){
		alert("Item has been dropped");
	}
});
//--------------------------Current Time--------------------------------
app.directive("myCurrentTime", function(dateFilter){
    return function(scope, element, attrs){
        var format;
        
        scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
        });
        
        function updateTime(){
            var dt = dateFilter(new Date(), format);
            element.text(dt);
        }
        
        function updateLater() {
            setTimeout(function() {
              updateTime(); // update DOM
              updateLater(); // schedule another update
            }, 1000);
        }
        
        updateLater();
    }
});

//-----------------------Widget Draggable-------------------------------

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

    element.on('mousedown', mousedown);
    element.on('touchend',mousedown);

    function mousedown(event) {

      //event.preventDefault(); 기본 이벤트를 지우는 함수

      //element와 마우스 커서의 상대 위치
      startX = event.pageX-element.prop('offsetLeft');
      startY = event.pageY-element.prop('offsetTop');
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
      
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
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  }

  
  return { 
    link : makeDraggable
      
  };

});

//----------------------------Widget-------------------------------------
app.directive('widget', function(){
    var linkFn = function(scope, element, attrs){        
        var showdel = function(e){
        	this.childNodes[0].childNodes[0].style.display="block";
        };

        var notshow=function(e){
        	this.childNodes[0].childNodes[0].style.display="none";
        };
       
        element.on('mouseover', showdel);
        element.on('mouseleave',notshow);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});



app.directive('divMemo',function(){
	return {
        restrict: 'E',
        template: '<div ng-draggable class="widget w_memo"><div class="end"><img class="delmemo"src="/images/wid_del.png"/></div><textarea rows="8" cols="25"></textarea></div>'
    };
})

app.directive('addmemo', function($compile){
    var linkFn = function(scope, element, attrs){        
        var addDiv = function(e){
                     
            angular.element(document.getElementById('home')).append($compile('<div-memo></div-memo>')(scope));  
			
            scope.$apply();
        };
        element.on('click', addDiv);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});


app.directive('delmemo', function(){
    var linkFn = function(scope, element, attrs){        
        var delDiv = function(e){           
        	this.parentNode.parentNode.remove(this);
        };
        
        element.on('click', delDiv);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});

app.directive('calendar', function(){
    var linkFn = function(scope, element, attrs){        
        var popcal = function(e){           
        	
        };
        
        element.on('click', popcal);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});
