<?php
echo "\n";
echo "PANDOC\n";
echo "******\n\n";

require_once('common.php');

$dirs = array
(
    realpath(__DIR__."/../../"),
    realpath(__DIR__."/../../sarrerie"),
    realpath(__DIR__."/../../berbak-esamoldiek")
);

$files = getFiles($dirs, array
(
	'/\.md/i'
));

# md danak batun

$text = "";
foreach($files as $file)
    $text.="\n".file_get_contents($file)."\n\pagebreak\n";

# md tenporal baten sartun, pdf bihurtu, eta mobidu

$to = realpath(__DIR__."/../../web/public/resources");

$temp = tmpfile();
$temp_filename = stream_get_meta_data($temp);
$temp_filename = $temp_filename['uri'];

file_put_contents($temp_filename, $text);
echo "PDF-a sortzen...\n";
shell_exec("pandoc {$temp_filename} -f markdown -t latex --pdf-engine=xelatex -o {$temp_filename}.pdf");
shell_exec("mv {$temp_filename}.pdf {$to}/bermiotarra.pdf");
echo "OK: {$to}/pdf/bermiotarra.pdf\n\n";

echo "EPUB-a sortzen...\n";
shell_exec("pandoc {$temp_filename} -f markdown -t epub -o {$temp_filename}.epub");
shell_exec("mv {$temp_filename}.epub {$to}/bermiotarra.epub");
echo "OK: {$to}/epub/bermiotarra.epub\n";