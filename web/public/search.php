<?php
include('../private/common.php');

$dirs = array
(
	realpath(__DIR__."/berbak"),
	realpath(__DIR__."/esamoldiek")
);

$search = getSearch();

if(!$search)
{
        $title = 'Bermiotarra: Bilatzailie';

        include('../private/templates/header.tpl');
        include('../private/templates/search.tpl');
        include('../private/templates/footer.tpl');
}
else
{

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
        
        $input_original = file_get_contents($file);
        $input_original = preg_replace("/^([\S\s]+)<body>\s*/im", '', $input_original);
        $input_original = preg_replace("/\s*<\/body>([\S\s]+)$/im", '', $input_original);

        $input_lower  = mb_strtolower($input_original, 'utf-8');
        
        $dom_original = new DOMDocument('1.0', 'utf-8');
        $dom_original->encoding = 'utf-8';
        $dom_original->loadHTML(utf8_decode($input_original));
        
        $xpath_original = new DOMXPath($dom_original);

        $dom = new DOMDocument('1.0', 'utf-8');
        $dom->encoding = 'utf-8';
        $dom->loadHTML(utf8_decode($input_lower));

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

                    $result[$m][] = $html;
                    $names[] = $a_name;
                }
            }
        }
    }

    foreach($result as $file => $values)
    {
        echo "<a href=\"{$file}\">{$file}</a>\n";
        foreach($values as $value)
            echo "{$value}\n";
    }
}

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
        $search  = mb_strtolower($search, 'utf-8');
    else
        return false;

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
