<?php
require_once('common.php');

$dirs = array
(
        realpath(__DIR__."/../../berbak-esamoldiek")
);

$files = getFiles($dirs, array
(
	'/\.md/i'
));

# md danak batun

$text = "";
foreach($files as $file)
    $text.=file_get_contents($file);

# md tenporal baten sartun, pdf bihurtu, eta mobidu

$to = realpath(__DIR__."/../../web/public");

$temp = tmpfile();
$temp_filename = stream_get_meta_data($temp)['uri'];

file_put_contents($temp_filename, $text);
shell_exec("pandoc {$temp_filename} -f markdown -t latex --latex-engine=xelatex -o {$temp_filename}.pdf");
shell_exec("mv {$temp_filename}.pdf {$to}/bermiotarra.pdf");