window.onload = function(){
	var notf = $$(".notf");
	for(var i = 0; i<notf.length; i++){
		notf[i].pulsate({ duration: 1});
	}
};
