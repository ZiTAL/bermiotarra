<?php
/*
if(isset($_POST['q']))
    header("location: /search/{$_POST['q']}/");
*/

include(__DIR__."/../private/common.php");

$dirs = array
(
	realpath(__DIR__."/berbak-esamoldiek")
);

$q = getSearch();

$title = 'Bermiotarra: Bilatzailie';

if($q!=='')
{
    $title.= " - {$q}";

    $files = getFiles($dirs, array
    (
            '/^[a-z]{1}\.html/i',
    ));

    $names = array();
    $result = array();
    foreach($files as $file)
    {
        preg_match("/[^\/]+\/[^\/]+\.html$/i", $file, $m);
        $m = $m[0];

        $input_original = file_get_contents($file);
        $input_original = preg_replace("/^([\S\s]+)<body>\s*/im", '', $input_original);
        $input_original = preg_replace("/\s*<\/body>([\S\s]+)$/im", '', $input_original);

        $input_lower  = mb_strtolower($input_original, 'utf-8');

        $dom_original = new DOMDocument('1.0', 'utf-8');
        $dom_original->encoding = 'utf-8';
        $dom_original->loadHTML($input_original);

        $xpath_original = new DOMXPath($dom_original);

        $dom = new DOMDocument('1.0', 'utf-8');
        $dom->encoding = 'utf-8';
        $dom->loadHTML(utf8_decode($input_lower));

        $xpath = new DOMXPath($dom);

		// h1-ak ezabatu
		$h1s = $xpath->query('//h1');
		if($h1s->length>0)
		{
			foreach($h1s as $h1)
				$h1->parentNode->removeChild($h1);
		}

        $content = $xpath->query("//div[@id=\"content\"]");
        $content = $content->item(0);

        $search_nodes = $xpath->query($content->getNodePath()."//*[contains(text(), '{$q}')]");

        if($search_nodes->length>0)
        {
            foreach($search_nodes as $sn)
            {
                $parent_node = getParentNode($sn);

                $h = getPrevNode($parent_node, 'h2');
                $a = $xpath->query('a', $h);
                $a = $a->item(0);
                $a->setAttribute('href', $m.$a->getAttribute('href'));

                $a_name = $a->nodeValue;

                if(!in_array($a_name, $names))
                {
                    $h_original = $xpath_original->query("//h2[@id=\"".$h->getAttribute('id')."\"]");
                    $h_original = $h_original->item(0);

                    $next_nodes = getNextNodes($h_original);
                    $html = "{$h_original->ownerDocument->saveHTML($h_original)}\n";

                    foreach($next_nodes as $nn)
                        $html.= $nn->ownerDocument->saveHTML($nn);

                    $html = utf8_decode($html);

                    $result[$m][] = $html;
                    $names[] = $a_name;
                }
            }
        }
    }
}

$search_results = '';
if(isset($result))
{
    foreach($result as $file => $values)
    {
        $search_results.= "<a href=\"{$file}\">{$file}</a>\n";
        foreach($values as $value)
            $search_results.="{$value}\n";
    }
}

$link_home = 'index.php';
include(__DIR__."/../private/templates/search.tpl");

function getSearch()
{
	global $argv;
	$q = NULL;

	if(isset($argv))
	{
		if(isset($argv[1]))
		{
			preg_match("/\-\-q=([^$]+)$/", $argv[1], $q);
			if($q)
				$q = $q[1];
		}
	}
	else
	{
		if(isset($_REQUEST))
		{
			if(isset($_REQUEST['q']))
				$q = $_REQUEST['q'];
		}
	}
	if($q)
        $q  = mb_strtolower($q, 'utf-8');
    else
        return '';

	return $q;
}

function getParentNode($node)
{
	do
	{
		if(!isset($parent_node))
			$tmp = $node;
		else
			$tmp = $parent_node;

		$parent_node = $tmp->parentNode;
	}
	while($parent_node->nodeName!=='div' && $parent_node->getAttribute('id')!=='content');

	$parent_node = $tmp;

	return $parent_node;
}

function getPrevNode($node, $node_name)
{
	if($node->nodeName===$node_name)
		return $node;

	do
	{
		if(!isset($tmp))
			$tmp = $node;
		else
			$tmp = $prev;

		$prev = $tmp->previousSibling;
	}
	while($prev->nodeName!==$node_name && $prev!==NULL);

	return $prev;
}

function getNextNodes($node)
{
    $result = array();

    do
    {
        if(!isset($next))
            $next = $node->nextSibling;
        else
            $next = $next->nextSibling;
        if($next)
            $result[] = $next;
        else
            break;
    }
    while($next->nodeName!=='h2' && $next->nodeName!=='h1');

    $result  = array_slice($result, 1, -1);
    return $result;
}
