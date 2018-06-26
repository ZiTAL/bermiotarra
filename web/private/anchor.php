<?php

function anchor($input, $title)
{
	$dom = new DOMDocument('1.0', 'utf-8');
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;

	$dom->loadHTML($input);
	$dom->encoding = 'utf-8';

	$str = $dom->saveHTML($dom->documentElement);
	$str = utf8_decode($str);

	$xpath = new DOMXPath($dom);

	// add anchor to all h2
	$hs = $xpath->query('//h2');

	foreach($hs as $h)
	{
		$node_value = $h->nodeValue;

		$anchor = preg_replace("/[\s\/]+/i", '-', $node_value);
		$anchor = preg_replace("/[^a-z\-]/i", '', $anchor);
		$anchor = strtolower($anchor);

		$a = $dom->createElement('a');
		$a->setAttribute('href', "#{$anchor}");
		$a->appendChild($dom->createTextNode($node_value));

		$h->removeAttribute('id');
		$h->setAttribute('id', $anchor);
		$h->removeChild($h->childNodes[0]);

		$h->appendChild($a);
	}

    $body = $dom->saveHTML($dom->documentElement);
    $body = utf8_decode($body);
    $body = preg_replace("/((.*?)<body>\s*|\s*<\/body>(.*?)$)/", '', $body);

	$title = "Bermiotarra: {$title}";

	$header = file_get_contents(__DIR__."/templates/header.tpl");
	$footer = file_get_contents(__DIR__."/templates/footer.tpl");

	$regex = "/".preg_quote('<?=$title;?>')."/";
	$header = preg_replace($regex, $title, $header);
	$regex = "/".preg_quote('<?=$link_home;?>')."/";
	$header = preg_replace($regex, '../', $header);

	$html = $header.$body.$footer;

	return $html;
}
