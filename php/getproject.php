<?php
include('help/delicious.php');

$projnum = $_REQUEST['project'];

$returnedproject = mysql_query("select category, name, client, text, contrib from project where id = '".$projnum."'");
$projimgs = mysql_query("select path from images where project = '".$projnum."'");

$theproject = array();
$theproject['project'] = array();
$theproject['project']['img'] = array(0 => '');

while ($proj_iter = mysql_fetch_array($returnedproject)){
	$theproject['project'] = array(
		"category" => $proj_iter['category'],
		"name" => $proj_iter['name'],
		"client" => $proj_iter['client'],
		"text" => $proj_iter['text'],
		"contrib" => $proj_iter['contrib']
	);	
}

while ($proj_img_iter = mysql_fetch_array($projimgs)){
	$theproject['project']['img'][] = $proj_img_iter['path'];
}

echo json_encode($theproject);

?>