
document.observe("dom:loaded", function() {
	var add=$("addwid");
	var del=$("delwid");
	var logout=$$("button.logout")[0];
	add.onclick=handleadd;
	del.onclick=handledel;
	logout.onclick = save;

	var widgets =$$(".widget");
	for(var i=0;i<widgets.length;i++){
		new Draggable(widgets[i]);
	}

});

var flagadd=0;
var flagdel=0;
function handleadd(){

	if(flagadd==0){
		addwidget();
		flagadd=1;
	}else{
		addcancle();
		flagadd=0;
	}
}

function handledel(){

	if(flagdel==0){
		delwidget();
		flagdel=1;
	}else{
		delcancle();
		flagdel=0;
	}
}

function addwidget(){

	$("addwid").style.backgroundColor="rgba(192, 190, 190, 0.78)";
	$("addlist").style.display="block";

	var list = $$("#addlist li");
	for (var i = 0; i < list.length; i++) {
		list[i].onclick=addwid;
	}
}

function addcancle(){
	$("addwid").style.backgroundColor="rgba(53, 53, 53, 0.78)";
	$("addlist").style.display="none";
}

function addwid(){
	$("addwid").style.backgroundColor="rgba(53, 53, 53, 0.78)";
	$("addlist").style.display="none";

	var add=this.firstChild.nodeValue;
	if(add =="Memo"){
		var div = document.createElement("div");
		var img = document.createElement("img");
		img.setAttribute("src","/users/GUEST/noun_17398.png");
		img.setAttribute("class","end");
		var textarea = document.createElement("textarea");
		div.addClassName("widget");
		div.addClassName("w_memo");
		textarea.setAttribute("rows","8");
		textarea.setAttribute("cols","25");
		div.appendChild(img);
		div.appendChild(textarea);
		new Draggable(div);
		$("section2").appendChild(div);


	}/*else if(add =="To do"){
		var span1 = document.createElement('span');
		span1.addClassName("done-{{list.done}}");
		var txt1 = document.createTextNode("{{list.text}}");
		span1.appendChild(txt1);
		var input = document.createElement('input');
		input.type= "checkbox";
		input.setAttribute("ng-model","list.done");
		var li = document.createElement("li");
		li.setAttribute("ng-repeat","list in lists");
		li.appendChild(input);
		li.appendChild(span1);

		var ul = document.createElement("ul");
		ul.id = "todolist";
		ul.appendChild(li);

		var txt2 = document.createTextNode("[");

		var a = document.createElement("a");
		a.href = "";
		a.setAttribute("ng-click","archive()");

		var txt3 = document.createTextNode("archive");
		a.appendChild(txt3);

		var txt4 = document.createTextNode("]");

		var span2 = document.createElement('span');

		var txt5 = document.createTextNode("{{remain()}} of {{lists.length}} remaining");

		span2.appendChild(txt5);

		var img = document.createElement('img');
		img.addClassName("end");
		img.src = "noun_17398.png";

		var div = document.createElement('div');
		div.id = "todolists";
		div.addClassName("widget");

		div.appendChild(img);
		div.appendChild(span2);
		div.appendChild(txt2);
		div.appendChild(a);
		div.appendChild(txt4);
		div.appendChild(ul);
		$("section2").appendChild(div);

	}*/

}
function delwidget(){
	var close=$$(".end");
	for (var i = 0; i < close.length; i++) {
		close[i].style.display="block";
		close[i].onclick=delwid;
	}
}
function delcancle(){
	var close=$$(".end");
	for (var i = 0; i < close.length; i++) {
		close[i].style.display="none";
	}
}
function delwid(){
	$("section2").removeChild(this.parentNode);
}


function save()
{
	var memo = [""];
	var left = [""];
	var top = [""];
	var memoOBJ = document.getElementsByTagName("textarea");
	var memoDiv = $$(".w_memo");
	for(var i = 0; i <memoOBJ.length; i ++)
	{
		memo.push(memoOBJ[i].value);
		left.push(memoDiv[i].getStyle("left"));
		top.push(memoDiv[i].getStyle("top"));
	}
	new Ajax.Request("http://localhost:9080/widget",{
    	method: "post",
    	parameters: {memo: memo, left: left, top: top}
    });
    var panelOBJ = $$("li a");
    var href=[""];
    var src=[""];
    var position=[""];
    var img = $$('.tosave');
  
  	for(var i =0; i <img.length; i++)
  	{
  		src.push(img[i].src);
  	}
    for(var i = 0; i < panelOBJ.length; i++)
    {
    	href.push(panelOBJ[i].href);
    	if(panelOBJ[i].parentNode.parentNode.parentNode.id=="leftdock")
    		position.push("left");
    	else if(panelOBJ[i].parentNode.parentNode.parentNode.id=="rightdock")
    		position.push("right");
    	else
    		position.push("center");
    }

 	new Ajax.Request("http://localhost:9080/app",{
    	method: "post",
    	parameters: {href: href ,src: src, position:position}
    });




}
