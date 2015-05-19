window.onload =function (){
    window.setTimeout(checkAuth, 1);
// social part
    showFriendList();

// cloud part
    var popup_Btn = document.getElementById("CLOUD");
    popup_Btn.onclick = cloud_popup;
  


// iframe part
    var max = false;
    var size_Btns = document.getElementsByClassName("sizeCtrl");
    for(var i=0; i<size_Btns.length; i++){
        size_Btns[i].onclick = function() {
            console.log(this);
            max = sizeControler(max, this.parentNode.parentNode);
        };    
    }
    var iframe_close_Btns = document.getElementsByClassName("iframeClose");
    for(var i=0; i<iframe_close_Btns.length;i++){
        iframe_close_Btns[i].onclick = function(){
            this.parentNode.parentNode.remove();
        }
    }
    var count=0;
    var iframe_Btns = document.getElementsByClassName("true");
    for(var i=0; i<iframe_Btns.length; i++){
        iframe_Btns[i].onclick = function() {
            console.log(this);
            var div1 = document.createElement("div");
            div1.id = "iframePopup" + count;
            div1.className = "Pstyle";

            var div2 = document.createElement("div");
            div2.className = "popTop";
            
            var div3 = document.createElement("div");
            div3.className = "iframeClose";
            var close = document.createTextNode("X");
            
            var div4 = document.createElement("div");
            div4.className = "sizeCtrl";
            var size = document.createTextNode("ㅁ");

            div3.appendChild(close);
            div4.appendChild(size);
            div2.appendChild(div3);
            div2.appendChild(div4);
            div1.appendChild(div2);
            //new Draggable(div1);
            //document.getElementById("iframe").appendChild(div1);
            document.body.appendChild(div1);

            var popId = "#iframePopup" + count;
            count++;
            $(popId).bPopup({
                modal: false,
                //closeClass: 'iframeClose',
                content: 'iframe',
                contentContainer: popId,
                iframeAttr: "scrolling='yes'",
                loadUrl: this.id
            });

            var max = false;
            var size_Btns = document.getElementsByClassName("sizeCtrl");
            for(var i=0; i<size_Btns.length; i++){
                size_Btns[i].onclick = function() {
                    console.log(this);
                    max = sizeControler(max, this.parentNode.parentNode);
                };    
            }
            var iframe_close_Btns = document.getElementsByClassName("iframeClose");
            for(var i=0; i<iframe_close_Btns.length;i++){
                iframe_close_Btns[i].onclick = function(){
                    this.parentNode.parentNode.remove();
                }
            }
            
        }
    }
// topbar part
    var Labeldropbox = document.getElementById('dropbox_label');
    Labeldropbox.onclick = authDropbox;
    var Labelgoogle = document.getElementById('googleDrive_label');
    Labelgoogle.onclick = authGoogle;
}
