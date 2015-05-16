/*			<div id = "friend_div">
                <table>          
                            <thead>
                                 <tr>
                                    <th width="20px">이름(ID)</th>
                                    <th width="40px">message</th>
                                    <th width="20px">방문</th>
                                </tr>
                            </thead>
                            <tbody>
                                 <tr class = "friends">
                                    <th width="20px">현태김(espy0117@gmail.com)</th>
                                    <th class="social_hide">espy0117@gmail.com</th>
                                    <th class="messageTo" width="40px">message</th>
                                    <th class="visitTo" width="20px"><a href ="visit?ID=espy0117@gmail.com">방문</a></th>
                                </tr>
                                 <tr class = "friends">
                                    <th width="20px">김현태(silbu1122@nate.com)</th>
                                    <th class="social_hide">silbu1122@nate.com</th>
                                    <th class="messageTo" width="40px">message</th>
                                    <th class="visitTo" width="20px"><a href ="visit?ID=silbu1122@nate.com">방문</a></th>
                                </tr>
                            </tbody>
                    </table>

               <input id = "input_friend" type = "text"><button id ="btn_searchFriend">검색</button>
               <div id = "newFriend">
               </div>
            </div>*/

function showFriendList(){
	var Divfriend = document.getElementById("friend_div");
	var messageTo = $$(".messageTo");
	var visitTo = $$(".visitTo");
	for(var i = 0; i<messageTo.length; i++)
		messageTo[i].onclick = messageToFriend;

	Divfriend.style.display = "block";
	var BtnsearchFriend = document.getElementById("btn_searchFriend");
	BtnsearchFriend.onclick = searchFriend;
}

function visitToFriend(){
	alert("visitTo");
	var id = this.parentNode.children[1].innerHTML;
	/*
	new Ajax.Request("/login",{
                    method: "get",
                    parameters: {'ID': id}
                });
*///이것은 안쓰는 함수.
}

function messageToFriend(){
	alert("messageTo");
}
function searchFriend(){
	var inputfriend = document.getElementById("input_friend");
	var BtnsearchFriend = document.getElementById("btn_searchFriend");
	var newFriend;
	this.style.display = "none";
	new Ajax.Request("/searchfriend",{
                    method: "get",
                    parameters: {'input': inputfriend.value},
                    onSuccess : function(response){
                    	console.log(response);
                    	if(response.responseJSON!=null)
                    	{
                    		var newfriend = response.responseJSON;
            				searchNewFriend(newfriend);
                    	}
                    	else{
                    		searchNewFriend(null);
                    	}
                    }
                });
	BtnsearchFriend.style.display = "block";
}

function searchNewFriend(newfriend){
	removeChildList("newFriend");
	if(newfriend == null){
		var  Divnewfriend = document.getElementById("newFriend");	
		var p = document.createElement("p");
		p.innerHTML = "검색된 결과가 없습니다.";
		Divnewfriend.appendChild(p);
	}
	else{	
		var  Divnewfriend = document.getElementById("newFriend");
	    var tr = document.createElement("tr");
	    var td_id = document.createElement("td"); 
	    var td_visit = document.createElement("td");
	    var td_add = document.createElement("td");
	    td_add.id = "addFriend";
	   
	    
	    var a = document.createElement('a');
	    a.innerHTML="방문";
	    a.href = "visit?ID="+newfriend.email;
	   
	  
	    td_visit.appendChild(a);

	    td_id.innerHTML = newfriend.email+"("+newfriend.name+")";
	    td_add.innerHTML = "친구추가";

	    tr.appendChild(td_id);
	    tr.appendChild(td_visit);
	    tr.appendChild(td_add);
	  	Divnewfriend.appendChild(tr);

	  	td_add.onclick = addFriend;
	}

}

function addFriend(){
    var idname = this.parentNode.children[0].innerHTML;
    var href = this.parentNode.children[1].children[0].href;
	var  Divnewfriend = document.getElementById("friend_tbody");
	var existFlag = 0;
	var id = href.split("?ID=");
	var name = idname.split("(");
	name =name[0];

	console.log(Divnewfriend.children.length);
	for(var i = 0; i < Divnewfriend.children.length; i++)
	{
		var previous = Divnewfriend.children[i].children[0].innerHTML
		
		if(idname == previous){
			existFlag++;
			break;
		}
	}
	if(!existFlag){
	    var tr = document.createElement("tr");
	    var td_idname = document.createElement("td"); 
	    var td_message = document.createElement("td");
	    var td_visit = document.createElement("td");

	    var a = document.createElement('a');
	    a.innerHTML="방문";
	    a.href = href;

	    td_visit.appendChild(a);

	    td_idname.innerHTML = idname;
	 	td_message.innerHTML = "message";
	 	td_message.className ="messageTo";
	 	td_message.onclick =messageToFriend;


	    tr.appendChild(td_idname);
	    tr.appendChild(td_message);
	    tr.appendChild(td_visit);
	  	Divnewfriend.appendChild(tr);

	  	
	  	new Ajax.Request("/addfriend",{
                    method: "post",
                    parameters: {'id': id[1],'name':name}
                });

	}

}