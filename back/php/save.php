<?php

include('help/delicious.php');

$whichproj = $_REQUEST['whichproj'];

$category = $_REQUEST['category'];
$name = $_REQUEST['name'];
$client = $_REQUEST['client'];
$text = $_REQUEST['text'];
$tile = $_REQUEST['tile'];
$tilepath = $_REQUEST['tilepath'];
$frontpromotion = $_REQUEST['frontpromote'];
$allprojpromotion = $_REQUEST['allprojpromote'];

$imgs = $_REQUEST['imgs'];

$order = $_REQUEST['order'];

if ($frontpromotion){
	$frontpromotion = 1;
	mysql_query("update project set frontpromoted = 0 where category = '".$category."'");
	mysql_query("update project set frontpromoted = 1 where category = '".$category."' and id = ".$whichproj);
	mysql_query("update categories set front = ".$whichproj." where cat = '".$category."'");
}

mysql_query("update images set tile = 0 where project = '".$whichproj."'");
mysql_query("update images set tile = 1 where id = ".$tile);

if ($allprojpromotion == 'true') $allprojpromotion = 1;
else $allprojpromotion = 0;

mysql_query('update project set 
	category = "'.$category.'",
	name = "'.$name.'",
	client = "'.$client.'",
	text = "'.$text.'",
	allprojpromoted = "'.$allprojpromotion.'",
 	tilepath = "'.$tilepath.'"
	where id = "'.$whichproj.'"');

echo $allprojpromotion;

if (!empty($imgs)){
	foreach($imgs as $img){
		mysql_query('update images set project = "'.$whichproj.'" where id = "'.$img.'"');
	}
}

foreach ($order as $key => $val) {
	mysql_query("update project set ordering = '".$key."' where id = '".$val."'");
}

?>