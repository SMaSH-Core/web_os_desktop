window.onload =function (){
    window.setTimeout(checkAuth, 1);
// cloud part
    var popup_Btn = document.getElementById("CLOUD");
    popup_Btn.onclick = cloud_popup;

    var Labeldropbox = document.getElementById('dropbox_label');
    Labeldropbox.onclick = authDropbox;
    var Labelgoogle = document.getElementById('googleDrive_label');
    Labelgoogle.onclick = authGoogle;

// finder part

    alert("hi");
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
/*
    var max = false;
    var size_Btn = document.getElementById("sizeCtrl");
    size_Btn.onclick = function() {
        max = sizeControler(max);
    };
    */
}