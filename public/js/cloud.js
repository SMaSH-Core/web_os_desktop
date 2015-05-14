var client = new Dropbox.Client({key: 'n6fec5ssr1ahnex'});
//google
var CLIENT_ID = '642713611296-3g6cpseokmpu6sld8q0mhaa54sp0bl03.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';
var DROP_CURRENT_PATH = [{name: 'DROPBOX',path: '/'}];
var GDRIVE_CURRENT_PATH = [];

function checkAuth() {  
    var CLOUD = document.getElementById("CLOUD");
    CLOUD.onclick = cloud_popup;
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult);
}

function handleAuthResult(authResult) {
    var Labelgoogle = document.getElementById("googleDrive_label");
    if (authResult && !authResult.error) {
        console.log(gapi.auth.getToken());
        Labelgoogle.style.color ='black'
        retrieveGoogleFiles();
    } else {
      Labelgoogle.style.color = 'red';
    }

    var Labeldropbox = document.getElementById('dropbox_label');
    if(client.isAuthenticated())
    Labeldropbox.style.color = 'black';
    else
    Labeldropbox.style.color = 'red';
}
function authGoogle(){
    console.log(gapi.auth.getToken());

    if(gapi.auth.getToken()==null)
    {
        gapi.auth.authorize(
                  {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                  handleAuthResult);
    }
    else
        console.log("로그인중");
}

function retrieveGoogleFiles(callback) {
    var request = gapi.client.request({
      'path': '/drive/v2/files',
      'method': 'GET'
    })
    request.execute(function(resp){
        for(var i = 0; i <resp.items.length; i ++){
            var splitType = resp.items[i].mimeType.split('/');
            var type = splitType[1];
            type = type.split('.');
            type = type[type.length-1];
            if(resp.items[i].fileSize == undefined)
                var size = '-';
            else
                var size = resp.items[i].fileSize;
            
            var file = {
                    name: resp.items[i].title,
                    size: size,
                    date: resp.items[i].modifiedDate,
                    path: resp.items[i].id,
                    type: type
                };
                appendChildList('google_file_List','google_File',file);
        }
    });
}

function readGoogleFile(){
    var filename = this.children[1].children[0].innerHTML;
    var type = this.children[0].innerHTML;
    var path = this.children[4].innerHTML;
    printFile(path); 

}
 function printFile(fileId) {
    var request = gapi.client.request({
        'path': 'drive/v2/files/fileId;',
        'params': {'fileId': fileId}
    });
    request.execute(function(resp) {
    console.log(resp);
    console.log('EmbedLink'+resp.embedLink);
    console.log('alterLinks'+resp.alternateLink);
    console.log('Title: ' + resp.title);
    console.log('Description: ' + resp.description);
    console.log('MIME type: ' + resp.mimeType);
    NewWindow(resp.alternateLink,fileId,'1300','1300','yes');
    });

}

function authDropbox(){
    console.log('hi');
    console.log(client);
    if(!client.isAuthenticated()){
        console.log(client.isAuthenticated());
        client.authenticate(function (error){
            if(error){
                alert("dropauth error");
                alert('Authentication error'+ error);
            }
            else{
                alert('hi drop auth');
                var datastoreManager = client.getDatastoreManager();
                datastoreManager.openDefaultDatastore(function (error,datastore) {
                    if (error) {
                        alert('Error opening default datastore: ' + error);
                    }else{        
                        var Labeldropbox = document.getElementById('dropbox_label');
                        Labeldropbox.style.color = 'black';   
                        retrieveDropFiles('/');
                    }
                });
            }
        });
    }else{
        console.log("이미 인증도있ㅇㅁ");
    }
}

function retrieveDropFiles(path) {                
    client.stat(path,{readDir :true},function(error,reply,stat,result)
    {
        removeChildList('drop_File');
          for(var i = 0; i<stat.length; i++){
            var splitType = stat[i].mimeType.split('/');
            var type;
            if(splitType[0]=='inode')
                type = splitType[1];
            else
                type = splitType[0];
            var file = {
                    name: stat[i].name,
                    size: stat[i].size,
                    date: stat[i].modifiedAt,
                    path: stat[i].path,
                    type: type
                };
                appendChildList('drop_file_list','drop_File',file);
            } 
    });                   
}

function readDropFile(){
    var filename = this.children[1].children[0].innerHTML;
    var type = this.children[0].innerHTML;
    var path = this.children[4].innerHTML;

    console.log('filename : \t'+filename);
    console.log('type \t'+type);

    if(type =="text"){
        client.readFile(path,function(err,string){
            if(err)
            console.log(err);
            else
            console.log(string);
        })
    }
    else if(type =="image"){
        console.log(DROP_CURRENT_PATH+'/'+filename)
       var imageURL = client.thumbnailUrl(path,{size: "l"});
       console.log(imageURL);
       NewWindow(imageURL,filename,'300','300','yes');
    }
    else if(type =="directory"){
        filedepth = {
            name: filename,
            path: path
        }
        DROP_CURRENT_PATH.push(filedepth);
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.innerHTML=filedepth.name;
        a.href = "#DROPBOX"+filedepth.path;
        li.appendChild(a);
        Listpath = document.getElementById("path_list");
        Listpath.appendChild(li);
        li.className = "current_droppath";
        li.onclick = moveTargetPath;
        retrieveDropFiles(path);

    }
}

function NewWindow(mypage, myname, w, h, scroll) {
    var winl = (screen.width - w) / 2;
    var wint = (screen.height - h) / 2;
    winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable'
    win = window.open(mypage, myname, winprops)
    if (parseInt(navigator.appVersion) >= 4){ 
        win.window.focus(); 
    }
}


function uploadFile(evt) {
    gapi.client.load('drive', 'v2', function() {
        var file = evt.target.files[0];
        insertFile(file);
    });
}
function insertFile(fileData, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";

	var reader = new FileReader();
	reader.readAsBinaryString(fileData);
	reader.onload = function(e) {
	    var contentType = fileData.type || 'application/octet-stream';
	    var metadata = {
	        'title': fileData.name,
	        'mimeType': contentType
	    };

	    var base64Data = btoa(reader.result);
	    var multipartRequestBody =
	        delimiter +
	        'Content-Type: application/json\r\n\r\n' +
	        JSON.stringify(metadata) +
	        delimiter +
	        'Content-Type: ' + contentType + '\r\n' +
	        'Content-Transfer-Encoding: base64\r\n' +
	        '\r\n' +
	        base64Data +
	        close_delim;

	    var request = gapi.client.request({
	        'path': '/upload/drive/v2/files',
	        'method': 'POST',
	        'params': {'uploadType': 'multipart'},
	        'headers': {
	        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
	        },
	      'body': multipartRequestBody});
	    if (!callback) {
	        callback = function(file) {
	        console.log(file)
	        };
	    }
		request.execute(callback);
	}
}

function writeToDrop() {
    client.writeFile('hello.txt', 'Hello, World!', function (error) {
        if (error) {
            alert('Error: ' + error);
        } else {
            alert('File written successfully!');
        }
    });
}
function removeChildList(id){
    var removeChild = document.getElementById(id);
    while (removeChild.firstChild){
        removeChild.removeChild(removeChild.firstChild);
    }
}
function appendChildList(classname,id,file){
    var File = document.getElementById(id);
    var tr = document.createElement("tr");
    var td_type = document.createElement("td"); 
    var td_name = document.createElement("td");
    var td_size = document.createElement("td");
    var td_date = document.createElement("td");   
    var td_path = document.createElement("td");
    
    var a = document.createElement('a');
    a.innerHTML=file.name;
    if(id =='google_File')
    a.href = "#GDRIVE/"+file.path;
    else
    a.href = "#DROPBOX"+file.path;
  
    td_name.appendChild(a);
    td_name.className = 'name';
    td_size.className = 'size';
    td_type.className = 'type';
    td_date.className = 'date';
    td_size.innerHTML = file.size;
    td_date.innerHTML = file.date;

    td_type.innerHTML = file.type;
    td_path.innerHTML = file.path;
    td_path.style.display='none';



    tr.appendChild(td_type);
    tr.appendChild(td_name);
    tr.appendChild(td_size);
    tr.appendChild(td_date);
    tr.appendChild(td_path);
    tr.className= classname;
    File.appendChild(tr);
    
    var FileList = $$('.'+classname);
    if(id =='google_File'){
        for(var i = 0;  i<FileList.length; i++){
            FileList[i].onclick = readGoogleFile;
        }
    }
    else{
        for(var i = 0; i <FileList.length; i++){
            FileList[i].onclick=readDropFile;
        }

    }
}
function NewWindow(mypage, myname, w, h, scroll) {
    var winl = (screen.width - w) / 2;
    var wint = (screen.height - h) / 2;
    winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable'
    win = window.open(mypage, myname, winprops)
    if (parseInt(navigator.appVersion) >= 4){ 
        win.window.focus(); 
    }
}

function cloud_popup() {
    $('#popup').bPopup({
        modal: false,
        scrollbar: true,
        transition: 'slideDown',
        transitionClose: 'slideDown',
        closeClass: 'finderClose'
    });

    var DropListpath = $$('.current_droppath');
    for(var i = 0; i <DropListpath.length; i++)
    {
        DropListpath[i].onclick = moveTargetPath;
    }
};

function moveTargetPath(){
    var path = this.children[0].href;
    var Listpath = document.getElementById('path_list');
    var TEMP_DROP_CURRENT_PATH= [];
    path = path.split('DROPBOX');
    path = path[1];
   
    while (Listpath.firstChild){
        Listpath.removeChild(Listpath.firstChild);
    }
    for(var i = 0; i <DROP_CURRENT_PATH.length; i++)
    {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.innerHTML=DROP_CURRENT_PATH[i].name;
        a.href = "#DROPBOX"+DROP_CURRENT_PATH[i].path;
        li.appendChild(a);
        Listpath = document.getElementById("path_list");
        Listpath.appendChild(li);
        li.className = "current_droppath";
        li.onclick = moveTargetPath;
        var file = {
                name: DROP_CURRENT_PATH[i].name,
                path: DROP_CURRENT_PATH[i].path 
            }
            TEMP_DROP_CURRENT_PATH.push(file);

        if(DROP_CURRENT_PATH[i].name == this.children[0].innerHTML){
            break;
        }
    }
    DROP_CURRENT_PATH = TEMP_DROP_CURRENT_PATH;
    retrieveDropFiles(path);
}