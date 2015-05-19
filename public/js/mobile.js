var app = angular.module("app",['ngRoute','ngTouch']);

app.controller("AppController", function($scope){
	$scope.hideurl=true;
	$scope.inputurl=true;
	$scope.showmenu=false;
	$scope.toggleMenu = function(){
		$scope.showmenu=($scope.showmenu) ? false : true;
	}
	$scope.format = 'h:mm';

});

app.directive('addurll',function($compile){
	var addurl = function(scope,element,attrs){
		var showw = function(e){
			e.stopPropagation();
    		e.preventDefault();
			scope.hideurl = false;
			scope.$apply();
		};
		//element.on('click',showw);
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
				var imgurl = 'http://www.google.com/s2/favicons?domain='+value;
				angular.element(document.getElementById('add_btn')).remove();
				angular.element(document.getElementById('apps')).append($compile("<a  href ='"+value+"' target = '_blank' id = "+imgurl+" ><img src = "+imgurl+" id = "+imgurl+" class = 'tosave' draggable/></a>")(scope));
				angular.element(document.getElementById('apps')).append($compile("<button class = 'addurl' id = 'add_btn'><img src = '/images/addurl.png' class = 'addurll'/></button>")(scope));
				scope.hideurl = true;
			}
			else{
				alert("잘못 입력하셨습니다.");
				scope.hideurl = true;
			}
			document.getElementById("slurl").value="";
			scope.$apply();
		}
		//element.on('click',adda);
		element.on('touchend',adda);
	};
	return{
		restrict : 'C',
		link: urlbtn
	}
});

app.directive('in',function(){
	var urlinput = function(scope,element,attrs){
		var prevent = function(e){
			e.stopPropagation();
    		//e.preventDefault();
		};
		//element.on('click',prevent);
		element.on('touchend',prevent);
	};
	return{
		restrict : 'C',
		link: urlinput
	}
});

app.directive('tosave',function(){
	var app = function(scope,element,attrs){
		var prevent = function(e){
			e.stopPropagation();
    		//e.preventDefault();
		};
		//element.on('click',prevent);
		element.on('touchend',prevent);
	};
	return{
		restrict : 'C',
		link: app
	}
});

//--------------------------Current Time--------------------------------
app.directive("myCurrentTime", function(dateFilter){
    return function(scope, element, attrs){
        var format;
        
        scope.$watch(attrs.myCurrentTime, function(value) {
            format = 'MMMddyyyy';
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


