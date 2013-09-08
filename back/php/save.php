<?php

include('help/delicious.php');

$whichproj = $_REQUEST['whichproj'];

$category = $_REQUEST['category'];
$name = $_REQUEST['name'];
$client = $_REQUEST['client'];
$text = $_REQUEST['text'];

$imgs = $_REQUEST['imgs'];

mysql_query('update project set 
	category = "'.$category.'",
	name = "'.$name.'",
	client = "'.$client.'",
	text = "'.$text.'"
	where id = "'.$whichproj.'"');

echo empty($imgs);

if (!empty($imgs)){
	foreach($imgs as $img){
		mysql_query('update images set project = "'.$whichproj.'" where id = "'.$img.'"');
	}
}

?>