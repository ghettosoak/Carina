<?php
	header("Content-Type: image/jpeg");

	$project = $_REQUEST['proj'];

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

		mysql_query("insert into images (project, path) values(" . $project . ", 'store/" . $nextimg . "')");

		if(!in_array(get_extension($me_image['name']),$allowed_ext)){
			exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
		}
		
		if(move_uploaded_file($me_image['tmp_name'], $upload_dir.$nextimg.'.jpg')){

			$img_stasis = new Imagick($upload_dir.$nextimg.'.jpg');

			$dimension = $img_stasis -> getImageGeometry(); 
			$w_orig = $dimension['width']; 
			$h_orig = $dimension['height']; 
			$ratio = $w_orig / $h_orig;

			$w_calc;
			$h_calc;

			$suffix = array( 
				'_mobile_1x', 
				'_mobile_2x', 
				'_tablet_1x', 
				'_tablet_2x', 
				'_desktop_1x', 
				'_desktop_2x' 
			);

			$w_calc = array( 767, 1534, 1024, 2046, 1250, 2500 );
			$h_calc = array( 
				intval(767 / $ratio), 
				intval(1534 / $ratio), 
				intval(1024 / $ratio), 
				intval(2046 / $ratio), 
				intval(1250 / $ratio), 
				intval(2500 / $ratio) 
			);

			for ($i = 0; $i < 6; $i++){
				$image_p = imagecreatetruecolor($w_calc[$i], $h_calc[$i]);
				
				$image = imagecreatefromjpeg($upload_dir . $nextimg. '.jpg');

				imagecopyresampled($image_p, $image, 0, 0, 0, 0, $w_calc[$i], $h_calc[$i], $w_orig, $h_orig);

				imagejpeg($image_p, $upload_dir . $nextimg . $suffix[$i] . '.jpg', 80);

				ImageDestroy($image_p);

				ImageDestroy($image);
			}

			echo json_encode(
				array(
					'img_id' => $nextimg,
					'_mobile_1x' => intval(767 / $ratio), 
					'_mobile_2x' => intval(1534 / $ratio), 
					'_tablet_1x' => intval(1024 / $ratio), 
					'_tablet_2x' => intval(2046 / $ratio), 
					'_desktop_1x' => intval(1250 / $ratio), 
					'_desktop_2x' => intval(2500 / $ratio),
					'path' => '../store/' . $nextimg
				)
			);

			exit;
		}
	}else{

		exit_status($_FILES);
	}


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