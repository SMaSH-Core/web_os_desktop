window.onload = function(){
	var dupmsg = $$(".dupmsg");
	for(var i = 0; i<dupmsg.length; i++){
		dupmsg[i].pulsate({ duration: 1});
	}
};
