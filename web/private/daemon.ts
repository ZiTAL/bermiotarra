import * as http   from 'http'
import { Search }  from './libs/search'
import { Server }  from './libs/server'

http.createServer(function(req:any, res:any)
{
  const url:string = Server.cleanUrl(req['url'])

  switch(url)
  {
    case '/search':
      new Search(req, res)
      break

    default:
      Server.write(res, 404, 'Not Found!')
      break
  }
}).listen(8080);
