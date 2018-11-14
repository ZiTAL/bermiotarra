<?php
include(__DIR__."/../private/constants.php");
include(__DIR__."/../private/common.php");

$dirs = array
(
	realpath(__DIR__."/berbak-esamoldiek"),
);
    
$files = getFiles($dirs, array
(
	'/^[a-z]{1}\.html/i',
));

$result = array();
foreach($files as $file)
{
	preg_match("/([^\/]+)\/([^\/]+)\.html$/i", $file, $m);
	if(!$m)
		continue;

	$link = $m[0];
	$dir = $m[1];
	$word = $m[2];
	
	if(!isset($result[$dir]))
		$result[$dir] = array();

	$result[$dir][] = array
	(
		'link' => $link,
		'word' => $word
	);
}

$title = TITLE;
$link_home = RELATIVE_ROOT;
$q = '';
include(__DIR__."/../private/templates/index.tpl");
