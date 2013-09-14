<?php

	header("Content-Type: image/jpeg");

	include('help/delicious_unjson.php'); 

	$slot = $_REQUEST['cover'];

	// $upload_dir = '../../store/cover/';
	// $allowed_ext = array('jpg','jpeg','pdf');

	// if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
	// 	exit_status('Error! Wrong HTTP method!');
	// }

	if(array_key_exists('covered',$_FILES) && $_FILES['covered']['error'] == 0 ){
		
		// $uploading = $_FILES['covered'];

		// $escapedname = str_replace(' ', '%20', $uploading['name']);

		// mysql_query("update covers set path = store/cover/".$uploading['name'].") where id = ".$slot);

		// if(!in_array(get_extension($uploading['name']),$allowed_ext)){
		// 	exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
		// }
		
		// if(move_uploaded_file($uploading['tmp_name'], $upload_dir.$nextimg.'.jpg')){
		// 	echo json_encode(array('img_id'=>$nextimg));
		// 	exit;
		// }
	}

// 	exit_status('FUCK');
//  
// 	function exit_status($str){
// 		echo json_encode(array('status'=>$str));
// 		exit;
// 	}

// 	function get_extension($file_name){
// 		$ext = explode('.', $file_name);
// 		$ext = array_pop($ext);
// 		return strtolower($ext);
// 	}

?>