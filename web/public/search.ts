import * as http    from 'http'
import * as fs      from 'fs'
import { JSDOM }    from 'jsdom'

let Req:object
let Res:object

http.createServer(function (req:object, res:object)
{
  Req = req
  Res = res

  const params:object  = parseGetParams(Req['url'])
  const url:string     = cleanUrl(Req['url'])

  switch(url)
  {
    case '/search':
      search(params)
      break
    default:
      showError(404, 'Not Found!')
      break
  }
}).listen(8080);

function parseGetParams(url:string):object
{
  let result:object       = {}
  let query_string:string = url.replace(/[^\?]+\?/, '')
  if(query_string==='')
    return result

  let params              = query_string.match(/([^=&]+)=([^=&]+)/g)
  if(params===null)
    return result

  if(params.length>0)
  {
    params.forEach(function(element)
    {
      let p         = element.match(/([^=&]+)=([^=&]+)/)
      if(p)
        result[p[1]]  = p[2]
    })
  }

  return result
}

function cleanUrl(url:string):string
{
  return url.replace(/\/?\?[^$]+$/, '')
}

function search(params:object)
{
  if(typeof params['q'] !== 'undefined')
  {
    const dir:string        = '/home/projects/bermiotarra/web/public/berbak-esamoldiek/'
    const files:object      = fs.readdirSync(dir)

    let found = []
    files['forEach'](function(file)
    {
      const html:string     = fs.readFileSync(dir+file, 'utf-8')
      const dom:object      = new JSDOM(html);
      const content:object  = dom['window']['document']['body'].querySelector('div[id="content"]')
      const childs:object   = content['childNodes']
      
      let words = getWords(childs)
      
      words.forEach(function(w)
      {
        let t:string = ''
        w.forEach(function(p)
        {
          t = t+p.textContent+"\n"
        })
        const r = new RegExp(decodeURI(params['q']), "gi");
        console.log(t, r)
        if(t.match(r))
        {
          found.push(w)
        }
      })
    })
    console.log(found);
  }
  else
    showError(400, 'Bad request!')
}

function getWords(childs)
{
  let deny_nodes = ['#text', 'H2']
  let words = [[]]
  let i     = -1
  childs.forEach(function(c)
  {
    const node_name = c.nodeName
    if(deny_nodes.indexOf(node_name)!==-1)
      return false;

    if(node_name==='H3')
    {
      i++;
      words[i] = []
    }          
    words[i].push(c)
  })
  return words
/*
  let t:string = ''
  words[1].forEach(function(c)
  {
    t = t+c.textContent+"\n"
  })
*/
}

function showError(code:number, text:string)
{
  Res['writeHead'](code)
  Res['end'](text)
}