<?php

include('help/delicious.php');

$kill = $_REQUEST['kill'];

$fetch = mysql_query("delete from images where id = ".$kill);

unlink('../../store/'.$kill.'.jpg');

?>