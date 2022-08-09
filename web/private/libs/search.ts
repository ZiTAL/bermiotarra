import * as Interfaces  from './interfaces'
import * as fs          from 'fs'
import { JSDOM }        from 'jsdom'
import { Server }       from './server'
import { View }         from './view'

const Constants         = require('./constants')

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
    //self.index()
  }

  index():void
  {
    let self                        = this

    let params:Interfaces.Object    = Constants
    params.LINK_HOME                = Constants.PUBLIC_ROOT+Constants.RELATIVE_ROOT    

    let html:string                 = self.getHtml()

    if(typeof self.params.q !== 'undefined')
      self.output(self.res, html, self.params.q)
    else
      Server.write(self.res, 400, 'Bad request!')
  }

  getHtml():string
  {
    let self                  = this
    let html:string           = ''

    if(typeof self.params.q !== 'undefined')
    {
      const dir:string        = __dirname+"/../../../public/berbak-esamoldiek/"
      const files:string[]    = fs.readdirSync(dir)  
      let founds:object[]     = []

      files.forEach(function(file:string)
      {
        html                          = fs.readFileSync(dir+file, 'utf-8')
        const dom:any                 = new JSDOM(html);
        const content:HTMLDivElement  = dom.window.document.body.querySelector('div[id="content"]')
        const childs:NodeList         = content.childNodes
        let words:any[]               = self.getWords(childs)

        words.forEach(function(w:any)
        {
          let t:string  = ''
          w.forEach(function(p:HTMLElement)
          {
            t = t+p.textContent+"\n"
          })
          const r       = new RegExp(decodeURI(self.params.q), "gi");
          if(t.match(r))
            founds.push(w)
        })
      })
      html = self.wordsToHtml(founds)
    }    
    return html
  }

  getWords(childs:any):HTMLElement[][]
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

  wordsToHtml(words:any):string
  {
    let html:string = ''
    words.forEach(function(w:HTMLElement[])
    {
      w.forEach(function(p:HTMLElement)
      {
        html = html + p.outerHTML
      })
    })
    return html
  }

  output(res:object, html:string, q:string):void
  {
    let params:Interfaces.Object    = Constants
    params.LINK_HOME                = Constants.PUBLIC_ROOT+Constants.RELATIVE_ROOT    
    //params.TITLE                    = `${params.TITLE} - Bilatzailie: ${q}` 

    html                            = View.load('./templates/header.jst', params)+
                                      html+
                                      View.load('./templates/footer.jst', Constants)

    Server.write(res, 200, html)
  }  
}