import * as fs from 'fs'

export class Server
{
  static parseGetParams(url:string):object
  {
    let result:object       = {}
    let query_string:string = url.replace(/[^\?]+\?/, '')
    let params              = query_string.match(/([^=&]+)=([^=&]+)/g)

    if(query_string==='' || params===null)
      return result
  
    if(params.length>0)
    {
      params.forEach(function(element)
      {
        let p               = element.match(/([^=&]+)=([^=&]+)/)
        if(p)
          result[p[1]]      = p[2]
      })
    }
  
    return result
  }
  
  static cleanUrl(url:string):string
  {
    return url.replace(/\/?\?[^$]+$/, '')
  }

  static write(res, code:number, text:string)
  {
    res.writeHead(code)
    res.end(text)
  }

  static view(file:string, params)
  {
    return (function(__params)
    {
      return eval("`"+fs.readFileSync(file, 'utf-8')+"`")
    })(params)
  }
}