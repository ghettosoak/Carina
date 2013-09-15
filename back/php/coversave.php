<?php

	header("Content-Type: image/jpeg");

	mysql_connect("localhost", "root", "root");
	mysql_select_db("carina");

	$slot = $_REQUEST["cover"];

	$upload_dir = '../../store/cover/';
	$allowed_ext = array('jpg','jpeg','pdf');

	if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
		exit_status('What the FUCK.');
	}

	if(array_key_exists('covered',$_FILES) && $_FILES['covered']['error'] == 0 ){
		
		$covered = $_FILES['covered'];

		$escapedname = str_replace(' ', '_', $covered['name']);

		// $oldcover = mysql_query('select path from covers where id = "'.$slot.'"');

		mysql_query("update covers set path = 'store/cover/".$escapedname."' where id = ".$slot);

		if(!in_array(get_extension($covered['name']),$allowed_ext)){
			exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
		}
		
		if(move_uploaded_file($covered['tmp_name'], $upload_dir.$escapedname)){
			exit_status('yeah!');
		}
	}

	exit_status('FUCK');
	
	function exit_status($str){
		echo json_encode(array('status'=>$str));
		exit;
	}

	function get_extension($file_name){
		$ext = explode('.', $file_name);
		$ext = array_pop($ext);
		return strtolower($ext);
	}

?>