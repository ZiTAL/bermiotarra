<?php

function anchor($input, $title)
{
	$dom = new DOMDocument('1.0', 'utf-8');
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;

	$dom->loadHTML(utf8_decode($input));
	$dom->encoding = 'utf-8';

	$xpath = new DOMXPath($dom);

	// remove all attributes
/*
	$attr = $xpath->query('//*[@*]');
	foreach($attr as $a)
	{
		while($a->hasAttributes())
			$a->removeAttribute($a->attributes->item(0)->nodeName);
	}
*/

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

	$body = $xpath->query('//body');
	$body = $body->item(0);
	$body = $body->ownerDocument->saveHTML($body);
	$body = preg_replace("/(^\s*<body>\s*|\s*<\/body>\s*$)/", '', $body);

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
