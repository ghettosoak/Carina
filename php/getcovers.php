<?php
include('help/delicious.php');

$thecovers = mysql_query('select path from covers where id > 2');

$covers = array();

while ($thecover = mysql_fetch_array($thecovers)){
	array_push($covers, $thecover['path']);
}

echo json_encode($covers);

?>