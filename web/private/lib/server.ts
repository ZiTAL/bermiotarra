import * as Interfaces  from './interfaces.ts'
import * as fs          from 'node:fs'

export class Server
{
  static parseGetParams(url:string):Interfaces.Object
  {
    let result:Interfaces.Object  = {}
    let query_string:string       = url.replace(/[^\?]+\?/, '')
    let params:any                = query_string.match(/([^=&]+)=([^=&]+)/g)

    if(query_string==='' || params===null)
      return result
  
    params.forEach(function(element:string)
    {
      let p:any = element.match(/([^=&]+)=([^=&]+)/)
      if(p)
        result[p[1]]  = p[2]
    })
  
    return result
  }
  
  static cleanUrl(url:string):string
  {
    return url.replace(/\/?\?[^$]+$/, '')
  }

  static write(res:any, code:number, text:string):void
  {
    res.writeHead(code, {'Content-Type': 'text/html; charset=utf-8'})
    res.end(text)
  }

  static view(file:string, params:object):string
  {
    return (function(__params:object)
    {
      return eval("`"+fs.readFileSync(file, 'utf-8')+"`")
    })(params)
  }
}