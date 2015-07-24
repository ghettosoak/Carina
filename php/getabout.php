<?php
include('help/delicious.php');

$theaboutimg = mysql_query('select path from covers where id = 2');
$theabouttext = mysql_query('select text, cv from her');
$theaboutCV = mysql_query('select path from covers where id = 1');

$about = array();
$about['about'] = array();

while ($anaboutimg = mysql_fetch_array($theaboutimg)){

	while ($anabouttext = mysql_fetch_array($theabouttext)){

		while ($anaboutCV = mysql_fetch_array($theaboutCV)){
			$about['about'][] = array(
				"img" => $anaboutimg['path'], 
				"text" => $anabouttext['text'],
				"cv" => $anaboutCV['path'] 
			);
		}
	}
}

echo json_encode($about);

?>