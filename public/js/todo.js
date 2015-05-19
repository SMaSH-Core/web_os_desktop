var app = angular.module('TaskManager', []); 

//controllers
app.controller('taskController', function($scope) {
    $scope.today = new Date();
    $scope.saved = localStorage.getItem('taskItems');
    $scope.taskItem = (localStorage.getItem('taskItems')!==null) ? 
    JSON.parse($scope.saved) : [ {description: "Why not add a task?", date: $scope.today, complete: false}];
    localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    c
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
    new Ajax.Request('/retrievetodo', {
            method: "post",
            onSuccess: function(response) {
                var newfriend = response.responseJSON;
                console.log(response);
                console.log("얍얍..");
                console.log(newfriend);
                $scope.taskItem = newfriend;
                //$scope.newTask= ht;
                localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
            }
        });
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
        console.log($scope.taskItem);
        new Ajax.Request('/savetodo', {
            method: "post",
            parameters: {'todolist': JSON.stringify($scope.taskItem)}
        });
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
app.controller("AppController", function($scope){
    $scope.showmenu=false;
    $scope.toggleMenu = function(){
    $scope.showmenu=($scope.showmenu) ? false : true;
    }
});

