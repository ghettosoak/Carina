<?php

include('help/delicious.php');

$her_email = $_REQUEST['email'];
$her_phone = $_REQUEST['phone'];
$her_text = $_REQUEST['text'];

mysql_query('update her set 
	email = "'.$her_email.'",
	phone = "'.$her_phone.'",
	text = "'.$her_text.'"
	where id = "1"');

?>