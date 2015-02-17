<?php
include('help/delicious.php');

$thecontact = mysql_query('select email, phone from her');
$theCV = mysql_query('select path from covers where id = 1');


$contact = array();
$contact['contact'] = array();

while ($anaboutCV = mysql_fetch_array($theCV)){

	while ($acontact = mysql_fetch_array($thecontact)){

		$contact['contact'][] = array(
			"email" => $acontact['email'], 
			"phone" => $acontact['phone']
		);
	}

}

echo json_encode($contact);

?>