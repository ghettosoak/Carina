<?php

include('help/delicious.php');

$kill = $_REQUEST['kill'];

$fetch = mysql_query("delete from project where id = ".$kill);

?>