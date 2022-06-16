import * as fs from 'fs'

export class Server
{
  static parseGetParams(url:string):object
  {
    let result:any       = {}
    let query_string:string = url.replace(/[^\?]+\?/, '')
    let params:any       = query_string.match(/([^=&]+)=([^=&]+)/g)

    if(query_string==='' || params===null)
      return result
  
    params.forEach(function(element:string)
    {
      let r:RegExp  = /([^=&]+)=([^=&]+)/
      let p:any     = element.match(r)
      if(p)
        result[p[1]]  = p[2]
    })
  
    return result
  }
  
  static cleanUrl(url:string):string
  {
    return url.replace(/\/?\?[^$]+$/, '')
  }

  static write(res:any, code:number, text:string)
  {
    res.writeHead(code)
    res.end(text)
  }

  static view(file:string, params:object)
  {
    return (function(__params:object)
    {
      return eval("`"+fs.readFileSync(file, 'utf-8')+"`")
    })(params)
  }
}