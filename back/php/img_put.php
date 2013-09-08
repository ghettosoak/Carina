<?php

	header("Content-Type: image/jpeg");

	include('help/delicious.php');

	$upload_dir = '../../store/';
	$allowed_ext = array('jpg','jpeg');

	if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
		exit_status('Error! Wrong HTTP method!');
	}

	if(array_key_exists('me_image',$_FILES) && $_FILES['me_image']['error'] == 0 ){
		
		$me_image = $_FILES['me_image'];

		$escapedname = str_replace(' ', '%20', $me_image['name']);
		
		$status = mysql_query("show table status like 'images'");
		$thestatus = mysql_fetch_array($status, MYSQL_ASSOC);

		$nextimg = $thestatus['Auto_increment'];

		mysql_query("insert into images (path) values('store/".$nextimg.".jpg')");

		if(!in_array(get_extension($me_image['name']),$allowed_ext)){
			exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
		}
		
		if(move_uploaded_file($me_image['tmp_name'], $upload_dir.$nextimg.'.jpg')){
			echo json_encode(array('img_id'=>$nextimg));
			exit;
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