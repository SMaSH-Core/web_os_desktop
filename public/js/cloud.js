var client = new Dropbox.Client({key: 'n6fec5ssr1ahnex'});
//google
var CLIENT_ID = '642713611296-3g6cpseokmpu6sld8q0mhaa54sp0bl03.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

window.onload =function (){
    window.setTimeout(checkAuth, 1);

    var popup_Btn = document.getElementById("CLOUD");
    popup_Btn.onclick = cloud_popup;
    var Btn_ajax = document.getElementById("Btn_ajax");
    Btn_ajax.onclick = saveApp;
    var h2dropauth = document.getElementById('dropauth');
    h2dropauth.onclick = authDropbox;
}

function checkAuth() {  
    var CLOUD = document.getElementById("CLOUD");
    CLOUD.onclick = cloud_popup;
    var DROPBOX = document.getElementById("DROPBOX");
    DROPBOX.onclick = authDropbox;
    var Btn_read = document.getElementById("Btn_read");
    Btn_read.onclick = readDropFileList;
    var Btn_write = document.getElementById("Btn_write");
    Btn_write.onclick = writeToDrop;
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult);
}

function handleAuthResult(authResult) {
    var authButton = document.getElementById('authorizeButton');
    var filePicker = document.getElementById('filePicker');
    var googleBtnRead = document.getElementById('googleBtn_read');
    //listBtn.onclick =retrieveAllFiles;
    googleBtnRead.style.display = 'none';
    if (authResult && !authResult.error) {
      // Access token has been successfully retrieved, requests can be sent to the API.
      //authButton.style.display = 'block';
      filePicker.style.display ='block';
      filePicker.onchange = uploadFile;
      googleBtnRead.style.display = 'block';
      googleBtnRead.onclick = retrieveAllFiles;
    } else {
      // No access token could be retrieved, show the button to start the authorization flow.
      authButton.style.display = 'block';
      authButton.onclick = function() {
          gapi.auth.authorize(
              {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
              handleAuthResult);
      };
    }
    if(client.isAuthenticated())
    {

        var h2dropauth = document.getElementById('dropauth');
        h2dropauth.style.color = 'black';
      

    }
    else
    {
        var h2dropauth = document.getElementById('dropauth');
        h2dropauth.style.color = 'red';
    }
}

function authDropbox(){
    client.authenticate(function (error){
        if(error){
            alert('Authentication error'+error);
        }
        else
            alert('hi drop auth');
        });
    var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error,datastore) {
            if (error) {
                alert('Error opening default datastore: ' + error);
            }else{
                 var h2dropauth = document.getElementById('dropauth');
                 h2dropauth.style.color = 'black';   
                 readDropFileList();
            }
    });
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
function readDropFileList() {                
	client.stat('/',{readDir :true},function(error,reply,stat,result){
	    var fileList =[];
	    for(var i = 0; i<stat.length; i++){
	        var file = {
                name: stat[i].name,
                size: stat[i].size,
                date: stat[i].modifiedAt,
                path: stat[i].path,
                type: stat[i].mimeType
            };
          
            fileList.push(file);
	    }  
        console.log(fileList);
		/*new Ajax.Request("http://localhost:9080/a",{
            method: "get",
            parameters: fileList
        }); */
        new EJS({url: '/template/d_main_cloud_list.ejs'}).update('dropbox', {fl:fileList});
	});              
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
function retrieveAllFiles(callback) {
    alert('hi');
    var request = gapi.client.request({
      'path': '/drive/v2/files',
      'method': 'GET'
    })
    request.execute(function(resp){
      console.log(resp.items);
    });
}
function cloud_popup() {
    $('#popup').bPopup({
        modal: false,
        scrollbar: true,
        transition: 'slideDown',
        transitionClose: 'slideDown',
        closeClass: 'finderClose'
    });
};