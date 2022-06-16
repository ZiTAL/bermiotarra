/*
use: ncc build ./terminal.ts -o dist/terminal.js
*/

import { Search }  from './libs/search'

let q:string    = process.argv.slice(2).join(' ')
let req:any     =
{
    q:      q,
    url:    "/search?q="+q
}
if(q==='')
    process.exit(1)

let html:string = new Search(req, {}).getHtml()
console.log(req.q)
console.log(html)
process.exit(0)