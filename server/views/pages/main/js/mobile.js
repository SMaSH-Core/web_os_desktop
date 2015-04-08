
var app = angular.module("app",[]);

function Ctrl($scope,$http){

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
};
