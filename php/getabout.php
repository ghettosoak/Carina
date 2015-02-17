<?php
include('help/delicious.php');

$theaboutimg = mysql_query('select path from covers where id = 2');
$theabouttext = mysql_query('select text, cv from her');

$about = array();
$about['about'] = array();

while ($anaboutimg = mysql_fetch_array($theaboutimg)){

	while ($anabouttext = mysql_fetch_array($theabouttext)){
		$about['about'][] = array(
			"img" => $anaboutimg['path'], 
			"text" => $anabouttext['text'],
			"cv" => $anabouttext['cv'] 
		);
	}
}

echo json_encode($about);

?>