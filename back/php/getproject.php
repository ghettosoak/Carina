<?php
include('help/delicious.php');

$whichproj = $_REQUEST['whichproj'];

$pulledproj = mysql_query('select name, client, text from project where id = "'.$whichproj.'"');
$pulledimg = mysql_query('select id, path from images where project = "'.$whichproj.'"');

$thisproj[] = array();
$thisproj['details'] = array();
$thisproj['details']['img'] = array();

while ($theproj = mysql_fetch_array($pulledproj)){
	$thisproj['details'] = array("name" => $theproj['name'], "client" => $theproj['client'], "text" => $theproj['text']);
}

while ($theimgs = mysql_fetch_array($pulledimg)){
	$thisproj['details']['img'][] = array('id' => $theimgs['id'], 'path' => '../'.$theimgs['path']);
}

echo json_encode($thisproj);

?>