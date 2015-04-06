function myCtrl($scope) {
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
}