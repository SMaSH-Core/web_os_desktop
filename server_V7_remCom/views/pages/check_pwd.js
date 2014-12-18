
function check_password(){
    var opw = $("pw");
    var cpw = $("pw2");
    var msg = $("confirm");
    if(cpw.value==""){
        msg.innerText = "Enter your password one more";
        msg.removeClassName("chk_fail");
        msg.removeClassName("chk_succ");
        return;
    }
    if(opw.value!=cpw.value){
        msg.innerHTML = "check password";
        msg.removeClassName("chk_succ");
        msg.addClassName("chk_fail");
    }else{
        msg.innerHTML = "ok";
        msg.removeClassName("chk_fail");
        msg.addClassName("chk_succ");
    }
}
function chk_submit(){
    var opw = $("pw");
    var cpw = $("pw2");
    if(opw.value==cpw.value && opw.value!=""){
        return true;
    }
    else{
        $("confirm").pulsate({ duration: 1});
        return false;
    }
}
window.onload=function(){
	$("pw2").onkeyup = check_password;
    $("pw").onkeyup = check_password;
	$("signform").onsubmit = chk_submit;
};
