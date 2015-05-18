/* This file is the code for implementing the slide of the dock bar and the addurl.
 * It is implemented by Angular.js
 *
 *
*/
var app = angular.module("app", []);
 
function Ctrl($scope, $http){

	//the panel that is app bucket is closed first
	$scope.param = {};
	$scope.slideapps = false;
	$scope.setting = function(){
		var x = document.getElementById("setting");
		var txt = "";
		if('files' in x){
			for(var i =0;i<x.files.length;i++){
				var file = x.files[i];
				if ('name' in file){
					document.body.style.background = "url("+file.name+") center center fixed";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundRepeat = 'no-repeat';
				}
			}
		}
	}
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
}
/*
app.directive('file',function(){
	return{
		scope: {
			file: '='
		},
		link: function(scope,element,attrs){
			element.bind('change',function(event){
				var files = event.target.files;
				var file = files[0];
				document.body.style.background = "url(../images/"+file.name+") center center fixed";
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundRepeat = 'no-repeat';
			});
		}
	};
});
*/

app.directive('ngEnter', function ($compile) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                    
                    if(scope.slideurl == true){
						var addurl2 = document.getElementById("slurl").value;
						if(addurl2 != "" && addurl2 != null){
							if(addurl2.search("http://") == -1){
								//alert(addurl2);
								addurl2 = "http://" + addurl2;
							}
							//alert(addurl2);
							var imgurl = 'http://www.google.com/s2/favicons?domain='+addurl2;
							angular.element(document.getElementById('panelul')).append($compile("<li><a class='false' href ='"+addurl2+"' target = '_blank' id = "+addurl2+" ><img src = "+imgurl+" id = "+addurl2+" class = 'tosave' draggable/></a></li>")(scope));
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
					document.getElementById("slurl").value = "";
					//scope.urlbtn = true;
					//scope.$apply();
                });
 			
                event.preventDefault();
            }
        });
    };
});
//----------------- file upload ------------------------------
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            data: {'name':file.name}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);
app.controller('Ctrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "public/images";
        fileUpload.uploadFileToUrl(file, uploadUrl);
        document.body.style.background = "url(../images/"+file.name+") center center fixed";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
    };
    
}]);




//-----------------------Dock Draggable-------------------------------
app.directive('draggable',function(){
	return function(scope,element){
		restrict : 'E';
		var e1 = element[0];
		e1.draggable = true;
		e1.addEventListener(
			'dragstart',function(e){
				e.dataTransfer.effectAllowed = 'move';
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
					this.classList.remove('over');
					var item = document.getElementById(e.dataTransfer.getData('Text'));

					if(this.id == "home"){
						item.parentNode.removeChild(item);
					}
					if(this.id == "trash"){

						item.parentNode.removeChild(item);
					}
					else{

						if(this.id == "leftdock" || this.id == "rightdock"){
							var list = item.parentNode;
							var li = document.createElement('li');

							li.appendChild(item);
							document.getElementById(this.id+"list").appendChild(li);
							list.parentNode.removeChild(list);

						}/*
						else{
							var li = document.createElement("li");
							li.appendChild(item);
							this.appendChild(li);
							//this.appendChild(item);
						}*/
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
					angular.element(document.getElementById('panelul')).append($compile("<li><a class='false' href ='"+addurl2+"' target = '_blank' id = "+addurl2+" ><img src = "+imgurl+" id = "+addurl2+" class = 'tosave' draggable/></a></li>")(scope));
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
			document.getElementById("slurl").value = "";
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
            format = 'hh:mm';
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

//----------------------------Widget Memo-------------------------------------
app.directive('widgetM', function(){
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
        template: '<div ng-draggable class="widget_m w_memo"><button id = "memocomple" class="leave">LEAVE</button><div class="end"><img class="delmemo"src="/images/wid_del.png"/></div><textarea rows="8" cols="25"></textarea></div>'
    };
})

app.directive('leaveGuest', function($compile){
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

app.directive('leave', function($compile){
    var linkFn = function(scope, element, attrs){        
        var clickleave = function(e){
        	var t = this;	//ajax가 되면 this가 윈도우로 변경됨.
        	this.style.display = "none";
        	this.parentNode.children[2].readOnly = true;
		    var targetId = document.getElementById("indicateFriend").children[0].innerHTML;
            targetId = targetId.split("(");
            targetId = targetId[1].split(")");
            targetId = targetId[0];
            var contents = this.parentNode.children[2].value;
            var currentTime = getTimeStamp();
            var left = this.parentNode.getStyle("left");
			var top = this.parentNode.getStyle("top");


			new Ajax.Request("/leaveguestbook",{
                    method: "post",
                    parameters: {'email': targetId, 'contents': contents, 'time': currentTime, 'left': left,'top': top },
                    onSuccess : function(response){
                    	var h2 = document.createElement('h2');
			        	var p = document.createElement('p');
						h2.innerHTML = response.responseJSON.who;
						p.innerHTML = response.responseJSON.time;
						t.parentNode.insertBefore(p,t.parentNode.children[0]);
						t.parentNode.insertBefore(h2,t.parentNode.children[0]);
                    }
                });
        };
        element.on('click', clickleave);
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

app.directive('save',function(){
	var link=function(scope, element, attrs){
		

		var save = function(e){ 
			alert('hi');         
        	var memo = [];
			var left = [];
			var top = [];
			var memoOBJ = document.getElementsByTagName("textarea");
			var memoDiv = $$(".w_memo");
			for(var i = 0; i <memoOBJ.length; i ++)
			{
				memo.push(memoOBJ[i].value);
				left.push(memoDiv[i].getStyle("left"));
				top.push(memoDiv[i].getStyle("top"));
			}
			
			new Ajax.Request("/widget",{
                    method: "post",
                    parameters: {'memo': memo, 'left': left, 'top': top}
                });

		    var panelOBJ = $$("li img");
		    var href=[];
		    var src=[];
		    var def=[];
		    var img = $$('.tosave');
/*
		  	for(var i =0; i <img.length; i++)
		  	{
		  		src.push(img[i].src);
		  	}
		  	*/
		    for(var i = 0; i < panelOBJ.length; i++)
		    {
		    	src.push(panelOBJ[i].src);
		    	href.push(panelOBJ[i].id);
		    	if(panelOBJ[i].classList.contains("true"))
		    		def.push("true");
		    	else
		    		def.push("false");
		    }
		    new Ajax.Request("/app",{

                    method: "post",
                    parameters: { 'href': href , 'src': src, 'def': def}
                });
/*
		    var taskName = [];
			var task = [];
			var top = [];
			var memoOBJ = document.getElementsByTagName("textarea");
			var memoDiv = $$(".w_memo");
			for(var i = 0; i <memoOBJ.length; i ++)
			{
				memo.push(memoOBJ[i].value);
				left.push(memoDiv[i].getStyle("left"));
				top.push(memoDiv[i].getStyle("top"));
			}
			
			new Ajax.Request("http://localhost:9081/widget",{
                    method: "post",
                    parameters: {'memo': memo, 'left': left, 'top': top}
                });*/
		};
		element.on('click',save);
	}

	return {
        restrict: 'C',
        link: link
    };

});
//----------------------------Widget calendar-------------------------------------


app.controller('MainSchedulerCtrl', function($scope) {
  $scope.events = [
  	{ id:1, text:"Task A-12458",
      start_date: new Date(2015,5,12),
      end_date: new Date(2015,5,16) },
    { id:2, text:"Task A-83473",
      start_date: new Date(2015,5,22),
      end_date: new Date(2015,5,24) }
  ];

  $scope.scheduler = { date : new Date() };
  //console.log($scope.events);


});

app.directive('dhxScheduler', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    

    link:function ($scope, $element, $attrs, $controller){
      //default state of the scheduler
      if (!$scope.scheduler)
        $scope.scheduler = {};
      $scope.scheduler.mode = $scope.scheduler.mode || "month";
      $scope.scheduler.date = $scope.scheduler.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        scheduler.clearAll();
        scheduler.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.scheduler.mode + $scope.scheduler.date.toString();
      }, function(nv, ov) {
        var mode = scheduler.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        scheduler.setCurrentView();
      });

      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      scheduler.init($element[0], $scope.scheduler.mode, $scope.scheduler.date);
    }
  }
});

app.directive('dhxTemplate', ['$filter', function($filter){
  scheduler.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      $element[0].style.display = 'none';

      var template = $element[0].innerHTML;
      template = template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{event\.([^\}]+)\}\}/g, function(match, prop){
        if (prop.indexOf("|") != -1){
          var parts = prop.split("|");
          return "\"+scheduler.aFilter('"+(parts[1]).trim()+"')(event."+(parts[0]).trim()+")+\"";
        }
        return '"+event.'+prop+'+"';
      });
      var templateFunc = Function('sd','ed','event', 'return "'+template+'"');
      scheduler.templates[$attrs.dhxTemplate] = templateFunc;
    }
  };
}]);
//----------------------------Widget todo-------------------------------------

app.controller('taskController', function($scope) {
    $scope.today = new Date();
    $scope.saved = localStorage.getItem('taskItems');
    $scope.taskItem = (localStorage.getItem('taskItems')!==null) ? 
    JSON.parse($scope.saved) : [ {description: "Why not add a task?", date: $scope.today, complete: false}];
    localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    
    $scope.newTask = null;
    $scope.newTaskDate = null;
    $scope.categories = [
        {name: 'Personal'},
        {name: 'Work'},
        {name: 'School'},
        {name: 'Cleaning'},
        {name: 'Other'}
    ];
    $scope.newTaskCategory = $scope.categories;
    $scope.addNew = function () {
        if ($scope.newTaskDate == null || $scope.newTaskDate == '') {
            $scope.taskItem.push({
                description: $scope.newTask,
                date: "No deadline",
                complete: false,
                category: $scope.newTaskCategory.name
            }) 
        } else {
            $scope.taskItem.push({
                description: $scope.newTask,
                date: $scope.newTaskDate,
                complete: false,
                category: $scope.newTaskCategory.name
            })
        };
        $scope.newTask = '';
        $scope.newTaskDate = '';
        $scope.newTaskCategory = $scope.categories;
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
    $scope.deleteTask = function () {
        var completedTask = $scope.taskItem;
        $scope.taskItem = [];
        angular.forEach(completedTask, function (taskItem) {
            if (!taskItem.complete) {
                $scope.taskItem.push(taskItem);
            }
        });
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
    
    $scope.save = function () {
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    }
});


/*
app.directive('zi', function(){
    var linkFn = function(){   
    	var maxz = $('.zi:last').css("zIndex");     
        var zIndex = function(e){
           
        	maxz++;
            this.css('z-index',maxz);           
        };
        element.on('click', zIndex);
    };
        
    return {
        restrict: 'C',
        link: linkFn
    };
});*/