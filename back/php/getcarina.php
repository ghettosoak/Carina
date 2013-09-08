<?php
include('help/delicious.php');

$category = $_REQUEST['category'];

$herdetails = mysql_query('select * from her');

$her;

while ($herintimate = mysql_fetch_array($herdetails)){
	$her = array(
		"email" => $herintimate['email'],
		"phone" => $herintimate['phone'],
		"text" => $herintimate['text'],
		"cv" => $herintimate['cv'],
		"img" => $herintimate['img']
	);
}

echo json_encode($her);

?>