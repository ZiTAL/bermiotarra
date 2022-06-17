<?php
include(__DIR__."/../private/constants.php");
include(__DIR__."/../private/common.php");

$title          = SEARCH_CAPTION;
$link_home      = RELATIVE_ROOT;
$q              = addslashes($_GET['q']);
$command        = "/opt/node/bin/node /home/projects/bermiotarra/web/private/dist/index.js \"{$q}\"";
$search_results = shell_exec($command);

include(__DIR__."/../private/templates/search.tpl");