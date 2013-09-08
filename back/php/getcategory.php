<?php
include('help/delicious.php');

$category = $_REQUEST['category'];

$foundproj = mysql_query('select id, name from project where category = "'.$category.'"');

$proj[] = array();
$proj['projects'] = array();

while ($theproj = mysql_fetch_array($foundproj)){
	$proj['projects'][] = array("id" => $theproj['id'], "name" => $theproj['name']);
}

echo json_encode($proj);

?>