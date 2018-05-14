<?php
include('common.php');
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

foreach($files as $file)
{
	preg_match("/([^\/]+)\/([^\/]+)\.md$/i", $file, $m);

	$type = $m[1];
	$letter = $m[2];

	$command = "{$pandoc} {$file}";
	$html = shell_exec($command);
	$html = anchor($html, "{$type} - {$letter}");

	$dir = "{$dir_output}/{$type}";
	if(!is_dir($dir))
		mkdir($dir);

	$file_output = "{$dir}/{$letter}.html";
	file_put_contents($file_output, $html);
}
