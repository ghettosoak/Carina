<?php
include('help/delicious.php');

$whichproj = $_REQUEST['whichproj'];

$pulledproj = mysql_query('select name, client, text, frontpromoted, allprojpromoted from project where id = "'.$whichproj.'"');
$pulledimg = mysql_query('select id, path, tile from images where project = "'.$whichproj.'"');

$thisproj[] = array();
$thisproj['details'] = array();
$thisproj['details']['img'] = array();

while ($theproj = mysql_fetch_array($pulledproj)){
	$thisproj['details'] = array("name" => $theproj['name'], "client" => $theproj['client'], "text" => $theproj['text'], "frontpromoted" => $theproj['frontpromoted'], "allprojpromoted" => $theproj['allprojpromoted']);
}

while ($theimgs = mysql_fetch_array($pulledimg)){
	$thisproj['details']['img'][] = array('id' => $theimgs['id'], 'path' => '../'.$theimgs['path'], 'tile' => $theimgs['tile']);
}

echo json_encode($thisproj);

?>