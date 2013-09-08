<?php
include('help/delicious.php');

$category = $_REQUEST['category'];

$thecovers = mysql_query('select path from covers');

$covers = array();

while ($thecover = mysql_fetch_array($thecovers)){
	array_push($covers, $thecover['path']);
}

echo json_encode($covers);

?>