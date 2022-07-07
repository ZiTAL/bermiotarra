import * as Interfaces  from './libs/interfaces'
import * as fs  from 'fs'
import { View } from './libs/view'

const Constants = require('./libs/constants')
const dirs:string[] =
[
    '../public/berbak-esamoldiek/'
]

let result:any = {}
dirs.forEach(function(dir)
{
    let files:string[]  = fs.readdirSync(dir)
    files = files.filter(function(f)
    {
        if(f.match(/[a-z]{1}\.html$/))
            return true
        return false
    })
    
    files.forEach(function(f)
    {
        const filename  = dir+f
        const m:any     = filename.match(/([^\/]+)\/([^\/]+)\.html$/i)
        if(m!==null)
        {
            const d:string  = m[1]
            result[d]       = result[d] || []

            result[d].push(
            {
                'link': m[0],
                'word': m[2]
            })
        }
    })
})


let params:Interfaces.Object    = Constants
params.link_home                = Constants.PUBLIC_ROOT+Constants.RELATIVE_ROOT

let html:string                 = ''
html                            = html+View.load('./templates/header.jst',      params)
html                            = html+View.load('./templates/search_box.jst',  {q: ''})
html                            = html+View.load('./templates/index.jst',       {result: result})
html                            = html+View.load('./templates/footer.jst',      Constants)

console.log(html)

/*

$title = TITLE;
$link_home = RELATIVE_ROOT;
$q = '';
include(__DIR__."/../private/templates/index.tpl");
*/