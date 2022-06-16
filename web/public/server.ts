import * as http   from 'http'
import { Search }  from '../private/libs/search'
import { Server }  from '../private/libs/server'


http.createServer(function (req:object, res:object)
{
  const url:string     = Server.cleanUrl(req['url'])

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
