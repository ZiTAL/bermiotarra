<?php

function anchor($input, $title)
{
	$dom = new DOMDocument('1.0', 'utf-8');
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;

	$dom->loadHTML($input);
	$dom->encoding = 'utf-8';

	$xpath = new DOMXPath($dom);

	// add anchor to all h3
	$hs = $xpath->query('//h3');

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

	// karaktere raruek HTML-ra ez pasateko
	$body = $xpath->query('//body');
	$body = $body->item(0);
	$body = $body->ownerDocument->saveHTML($body);
	$body = utf8_decode($body);
	// <body> </body> kendu
	$body = preg_replace("/(^\s*<body>\s*|\s*<\/body>\s*$)/", '', $body);

	$title = "Bermiotarra: {$title}";
/*
	$header = eval("?>".file_get_contents(__DIR__."/templates/header.tpl")."<?php");
    $footer = eval("?>".file_get_contents(__DIR__."/templates/footer.tpl")."<?php");
*/
    $header = include_var(__DIR__."/templates/header.tpl", array
    (
        'title' => $title,
        'link_home' => '../'
    ));
    $footer = include_var(__DIR__."/templates/footer.tpl", array
    (
        
    ));
/*
	$regex = "/".preg_quote('<?=$title;?>')."/";
	$header = preg_replace($regex, $title, $header);
	$regex = "/".preg_quote('<?=$link_home;?>')."/";
	$header = preg_replace($regex, '../', $header);
*/
	$html = $header.$body.$footer;

	return $html;
}

function include_var($file, $vars = NULL)
{
    if($vars!==NULL)
        extract($vars);
    ob_start();
    include($file);
    return ob_get_clean();
}