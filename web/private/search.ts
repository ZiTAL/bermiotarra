import * as Interfaces  from './lib/interfaces'
import { Search }  from './lib/search'

let q:string                = process.argv.slice(2).join(' ')
let req:Interfaces.Object   =
{
    q:      q,
    url:    `/search?q=${q}`
}
if(q==='')
    process.exit(1)

let html:string = new Search(req, {}).getHtml()
console.log(html)
process.exit(0)