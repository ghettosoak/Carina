<?php
include('help/delicious.php');

$category = $_REQUEST['category'];

$theprojs = mysql_query("select id, name, tilepath from project where category = '".$category."'");

$tiles = array();
$tiles['tiles'] = array();

while ($thetile = mysql_fetch_array($theprojs)){
	$tiles['tiles'][] = array("id" => $thetile['id'], "name" => $thetile['name'], "img" => $thetile['tilepath']);
}

echo json_encode($tiles);

?>