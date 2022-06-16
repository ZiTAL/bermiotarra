import * as fs      from 'fs'
import { JSDOM }    from 'jsdom'
import { Server }   from './server'

export class Search
{
  node_group_break:   string = 'H3'
  req:                any
  res:                any
  params:             any

  constructor(req:any, res:any)
  {
    let self    = this
    self.req    = req
    self.res    = res
    self.params = Server.parseGetParams(req.url)
    self.index()
  }

  index()
  {
    let self          = this

    if(typeof self.params['q'] !== 'undefined')
    {
      const dir:string        = __dirname+"/../../public/berbak-esamoldiek/"
      const files             = fs.readdirSync(dir)  
      let founds: object[]    = []
      let html:string         = ''

      files.forEach(function(file)
      {
        html                  = fs.readFileSync(dir+file, 'utf-8')
        const dom:any         = new JSDOM(html);
        const content:Node    = dom.window.document.body.querySelector('div[id="content"]')
        const childs:NodeList = content.childNodes
        let words             = self.getWords(childs)

        words.forEach(function(w)
        {
          let t:string = ''
          w.forEach(function(p:HTMLElement)
          {
            t = t+p.textContent+"\n"
          })
          const r = new RegExp(decodeURI(self.params.q), "gi");
          if(t.match(r))
            founds.push(w)
        })
      })
      html = self.wordsToHtml(founds)
      self.output(self.res, html)
    }
    else
      Server.write(self.res, 400, 'Bad request!')
  }

  getWords(childs:any)
  {
    let self                  = this
    let deny_nodes:string[]   = ['#text', 'H2']
    let words:HTMLElement[][] = [[]]
    let i:number              = -1

    childs.forEach(function(c:any)
    {
      const node_name = c.nodeName
      if(deny_nodes.indexOf(node_name)!==-1)
        return false;
  
      if(node_name===self.node_group_break)
      {
        i++;
        words[i] = []
      }          
      words[i].push(c)
    })
    return words
  }

  wordsToHtml(words:any)
  {
    let html = ''
    words.forEach(function(w:HTMLElement[])
    {
      w.forEach(function(p:HTMLElement)
      {
        html = html + p.outerHTML
      })
    })
    return html
  }

  output(res:object, html:string)
  {
    let self            = this
    const params        = 
    {
      'PUBLIC_ROOT':    'http://zital-pi.no-ip.org',
      'RELATIVE_ROOT':  '/bermiotarra/',
      'title':          '',
      'link_home':      '../'
    }    
    const header        = Server.view(__dirname+"/../templates/header.jst", params)
    const footer        = Server.view(__dirname+"/../templates/footer.jst", params)

    html = header + html + footer

    Server.write(res, 200, html)
  }  
}