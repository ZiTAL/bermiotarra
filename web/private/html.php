<?php
require_once('constants.php');
require_once('common.php');
include('anchor.php');

$dir_output = realpath(__DIR__."/../public/");

$dirs = array
(
        realpath(__DIR__."/../public/berbak-esamoldiek")
);

foreach($dirs as $dir)
{
    $command = "rm -rf {$dir}";
    shell_exec($command);
}

$dirs = array
(
        realpath(__DIR__."/../../berbak-esamoldiek")
);

// -----------------------------------

$files = getFiles($dirs, array
(
	'/\.md/i'
));

$pandoc = "pandoc -f markdown -t html5 ";

$tmp_file = tmpfile();
$tmp_path = stream_get_meta_data($tmp_file);
$tmp_path = $tmp_path['uri'];
$tmp_path = "/tmp/sasi";

foreach($files as $file)
{
	copy($file, $tmp_path);

	echo "{$tmp_path}\n";

    // fitxategi tenporal baten sartuten dot, gero "#" bat gehidxau sartuteko, H2, eta H3 bihurtuteko
	$tmp_content = file_get_contents($tmp_path);
	$tmp_content = preg_replace("/##\s+([^#]+)\s+##\s*\n/", "### $1 ###\n\n", $tmp_content);
	$tmp_content = preg_replace("/#\s+([^#]+)\s+#\s*\n/", "## $1 ##\n\n", $tmp_content);
	file_put_contents($tmp_path, $tmp_content);

	preg_match("/([^\/]+)\/([^\/]+)\.md$/i", $file, $m);

	$type = $m[1];
	$letter = $m[2];

	$command = "{$pandoc} {$tmp_path}";
	$html = shell_exec($command);
	$html = anchor($html, "{$type} - {$letter}");

	$dir = "{$dir_output}/{$type}";
	if(!is_dir($dir))
		mkdir($dir);

	$file_output = "{$dir}/{$letter}.html";
	file_put_contents($file_output, $html);
}