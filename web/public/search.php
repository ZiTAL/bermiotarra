<?php
include('../private/common.php');

$dirs = array
(
	realpath(__DIR__."/berbak"),
	realpath(__DIR__."/esamoldiek")
);

$search = getSearch();

if(!$search)
	exit('E_SEARCH');

$files = getFiles($dirs, array
(
        '/\.html/i'
));

$names = array();
$result = array();
foreach($files as $file)
{
    preg_match("/[^\/]+\/[^\/]+\.html$/i", $file, $m);
    $m = $m[0];
    
    $input = file_get_contents($file);

	$input = preg_replace("/^([\S\s]+)<body>\s*/im", '', $input);
	$input = preg_replace("/\s*<\/body>([\S\s]+)$/im", '', $input);

    $dom = new DOMDocument('1.0', 'utf-8');
    $dom->encoding = 'utf-8';
    $dom->loadHTML(utf8_decode($input));

    $xpath = new DOMXPath($dom);
    $search_nodes = $xpath->query("//*[contains(text(), '{$search}')]");

    if($search_nodes->length>0)
    {
        foreach($search_nodes as $sn)
        {
            $parent_node = getParentNode($sn);
            $h = getPrevNode($parent_node, 'h2');
            $a = $xpath->query('a', $h);
            $a = $a->item(0);
            $a_name = $a->nodeValue;
            
            if(!in_array($a_name, $names))
            {
                $result[$m][] = array
                (
                    'name' => $a_name,
                    'href' => $a->getAttribute('href')
                );
                $names[] = $a_name;
            }
        }
    }
}

print_r($result);

function getSearch()
{
	global $argv;
	$search = NULL;

	if(isset($argv))
	{
		if(isset($argv[1]))
		{
			preg_match("/\-\-search=([^$]+)$/", $argv[1], $search);
			if($search)
				$search = $search[1];
		}
	}
	else
	{
		if(isset($_REQUEST))
		{
			if(isset($_REQUEST['search']))
				$search = $_REQUEST['search'];
		}
	}
	if($search)
        $search = strtolower($search);
	return $search;
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
	while($parent_node->nodeName!=='body');

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
