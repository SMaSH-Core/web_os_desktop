/*
angular.element(document).ready(function(){
	angular.bootstrap(document.getElementById('info'));
	angular.bootstrap(document.getElementById('main'));
	angular.bootstrap(document.getElementById('dock'));
});

angular.bootstrap(document.body, []);
*/
<script>
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
			dock1.style.bottom = "10%";
			dock1.style.transition = "all 1.5s";
		}
		//If the app bucket is closed, it will be opened.
		else{
			$scope.slideapps = true;
			$scope.siideapps = !$scope.slide;
			var dock2 = document.getElementById("dock");
			dock2.style.bottom = "350px";
			dock2.style.transition = "all 1.5s";
		}
	};
}
<script>

