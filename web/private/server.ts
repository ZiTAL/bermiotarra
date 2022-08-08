import * as http   from 'http'
import { Search }  from './libs/search'
import { Server }  from './libs/server'

http.createServer(function(req:any, res:any):void
{
  const url:string = Server.cleanUrl(req.url)

  switch(url)
  {
    case '/search':
      new Search(req, res).index()
      break

    default:
      Server.write(res, 404, 'Not Found!')
      break
  }
}).listen(8080);
