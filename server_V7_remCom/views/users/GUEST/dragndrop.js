

document.observe("dom:loaded", function(){


	Sortable.create("leftdock");
	Sortable.create("rightdock");
	
	Droppables.add("leftdock", {onDrop: addapps});
	Droppables.add("rightdock", {onDrop: addapps});
	Droppables.add("panel",{onDrop: addapps});
	Droppables.add("trash", {onDrop: trash});

	var images = $$("#dock img");

	for (var i = images.length - 1; i >= 0; i--) {
		
		new Draggable(images[i],{revert: true});
	}

	
});

function addapps(drag,drop,event){
/*
	alert(event.element());
	var ele = event.element().parentNode;
	if(drop.id == "leftdock"){
		if($("leftdock").children.length < 5){
			$("leftdock").insertBefore(node,$("leftdock").childNodes[0]);
		}
	}
*/
	//alert(drag.id);
	//alert(event.element());
	//var test = JSON.parse('{"what":"2"}');
	//alert(test);
	//alert(event.element().parentNode.parentNode);

	var node = event.element().parentNode.parentNode;
	//alert(drop.id);
	if(drop.id == "rightdock"){
		if($("rightdocklist").children.length < 5){
		//var draged = drag.clone();
		//node.clone
		$("rightdocklist").insertBefore(node,$("rightdocklist").childNodes[0]);
		
		}
	}
	else if(drop.id == "leftdock"){
		if($$("#leftlist li").length < 5){
		$("leftdocklist").insertBefore(node,$("leftdocklist").childNodes[0]);
		
		}
	}else if(drop.id == "panel"){
		$("panelul").appendChild(node);
	}


}

function trash(drag,drop,event){


	var node = event.element().parentNode.parentNode;
	$('panelul').removeChild(node);
}

function copyObj(obj){
	return JSON.parse(JSON.stringify(obj));
}
