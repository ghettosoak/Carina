<?php

include('help/delicious.php');

$category = $_REQUEST['category'];

mysql_query('insert into project set category = "'.$category.'"');

echo mysql_insert_id();

?>