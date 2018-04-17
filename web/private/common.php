<?php

function getFiles($dirs)
{
    $allow = array
    (
        '/\.html/i'
    );
    $files = array();
    foreach($dirs as $dir)
    {
        $f = scandir($dir);

        foreach($f as $g)
        {
            foreach($allow as $a)
            {
                if(preg_match($a, $g))
                    $files[] = "{$dir}/{$g}";
            }
        }
    }
    return $files;
}
