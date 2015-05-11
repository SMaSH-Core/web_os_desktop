window.onload =function (){
    window.setTimeout(checkAuth, 1);
// cloud part
    var popup_Btn = document.getElementById("CLOUD");
    popup_Btn.onclick = cloud_popup;
    var Btn_ajax = document.getElementById("Btn_ajax");
    Btn_ajax.onclick = saveApp;
    var h2dropauth = document.getElementById('dropauth');
    h2dropauth.onclick = authDropbox;
// finder part
    var max = false;
    var size_Btn = document.getElementById("sizeCtrl");
    size_Btn.onclick = function() {
        max = sizeControler(max);
    };
}