/*window.onload =function (){
    var max = false;
    var size_Btn = document.getElementById("sizeCtrl");
    size_Btn.onclick = function() {
        max = sizeControler(max);
    };
}
*/
function sizeControler(max, pop) {
    console.log(max+", go to max");
    if(max == false){
        pop.style.left = "0";
        pop.style.top = "0";
        pop.style.width = "100%";
        pop.style.height = "100%";
        return true;
    }
    else{
        console.log(max+", go to min");
        pop.style.left = "20%";
        pop.style.top = "20%";
        pop.style.width = "60%";
        pop.style.height = "60%";    
        return false;
    }
}