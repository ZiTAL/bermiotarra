import * as http from "http"

http.createServer(function (req, res)
{
  const params:object  = parseGetParams(req.url)
  const url:string     = cleanUrl(req.url)

  switch(url)
  {
    case '/search':
      break
    default:
      break
  }

  res.writeHead(200);
  res.end('Hello, World!');
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
      result[p[1]]  = p[2]
    })
  }

  return result
}

function cleanUrl(url:string):string
{
  return url.replace(/\/?\?[^$]+$/, '')
}