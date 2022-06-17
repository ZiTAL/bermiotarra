<?php
include(__DIR__."/../private/constants.php");
include(__DIR__."/../private/common.php");

$title          = SEARCH_CAPTION;
$link_home      = RELATIVE_ROOT;
$q              = addslashes($_GET['q']);
$command        = NODE." ".$_SERVER['DOCUMENT_ROOT']."/../private/dist/index.js \"{$q}\"";
$search_results = shell_exec($command);

include(__DIR__."/../private/templates/search.tpl");