/* This file is the code for implementing the slide of the dock bar and the addurl.
 * It is implemented by Angular.js
 *
 *
*/
var app = angular.module("app", []);

function Ctrl($scope){


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
	$scope.urlbtn = true;
	$scope.slideurl = false;
	$scope.addurl = function(){
		
		if ($scope.urlbtn){
			$scope.urlbtn = false;
			$scope.slideurl = true;
			$scope.urlbtn = !$scope.addurl;
			/*
			var modify = document.getElementById("modifyurl");
			modify.style.transition = "all 1.0s";
			*/
			
		}
	};

	$scope.addurl2 = function(){
		if ($scope.slideurl){
			$scope.urlbtn = true;
			$scope.slideurl = false;
			$scope.slideurl = !$scope.addurl2;

			var addurl = document.getElementById("slurl").value;
			//alert(addurl);
			if(addurl != "" && addurl != null){
				var li = document.createElement("li");
				var a = document.createElement("a");
				var img = document.createElement("img");
				img.className="tosave";

				a.href = addurl;
				a.target = "_blank";
				
				img.src = "http://www.google.com/s2/favicons?domain="+addurl;
				//alert(a.href);
				a.appendChild(img);
				li.appendChild(a);
				new Draggable(img,{revert: true});

				document.getElementById('panelul').appendChild(li);
				$("panelul").lastChild.shake({
					distance: 3,
					duration: 0.5
				});

				


			}
			else if(addurl == ""){
				alert("Your input is incorrect!");
			}
/*
			var modify = document.getElementById("modifyurl");
			modify.style.transition = "all 1.0s";
			*/

		}
	};
	$scope.format = 'h:mm:ss a';
	
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

