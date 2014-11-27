


<?php
	if (!isset($_POST["name"])||!isset($_POST["email"])||!isset($_POST["pw"])||!isset($_POST["pw2"]))
	{
			header("HTTP/1.1 400 Invalid Request");
		    die("HTTP/1.1 400 Invalid Request - you have submitted incomplete form.");
		}

		#DB 아이디랑 , 암호 확인하세요
		#table명 =UserData
		#암호 = root
		#id =root로 저는 설정되있답니다. 각자에 맞게 이부분 수정
		#이부분은 name, email, pw, pw2에대한 유효성 검사를 할 부분 11/1일 전까지 하겠음. .

	$user_name = $_POST["name"];
	$user_mail = $_POST["email"];
	$user_pw = $_POST["pw"];



	try {
	    $db = new PDO("mysql:host=localhost;dbname=WebPro", "root", "root");
	    // set the PDO error mode to exception
	    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $sql = "INSERT INTO UserData VALUES ('$user_mail', '$user_pw', '$user_name')";
	    // use exec() because no results are returned
	    $db->exec($sql);
	    echo "New record created successfully";
	    }
	catch(PDOException $e)
	    {
	    echo $sql . "<br>" . $e->getMessage();
	    }


?>