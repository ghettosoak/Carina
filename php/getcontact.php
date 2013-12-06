<?php
include('help/delicious.php');

$thecontact = mysql_query('select email, phone, cv from her');

$contact = array();
$contact['contact'] = array();

while ($acontact = mysql_fetch_array($thecontact)){

	$contact['contact'][] = array(
		"email" => $acontact['email'], 
		"phone" => $acontact['phone'],
		"cv" => $acontact['cv']
	);
}

echo json_encode($contact);

?>