import * as Interfaces  from './interfaces.ts'
import * as fs          from 'node:fs'
import * as path        from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM }        from 'jsdom'
import { Server }       from './server.ts'
import { View }         from './view.ts'

import Constants        from './constants.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  }

  index():void
  {
    let self                        = this
    let html:string                 = self.getHtml()

    if(typeof self.params.q !== 'undefined')
      self.output(self.res, html, decodeURIComponent(self.params.q.replace(/\+/g, ' ')))
    else
      Server.write(self.res, 400, 'Bad request!')
  }

  getHtml():string
  {
    let self                  = this
    let html:string           = ''

    if(typeof self.params.q !== 'undefined')
    {
      const dir:string                = __dirname+"/../../public/berbak-esamoldiek/"
      const files:string[]            = fs.readdirSync(dir)  
      let founds:Interfaces.Object[]  = []

      files.forEach(function(file:string)
      {
        html                          = fs.readFileSync(dir+file, 'utf-8')
        const dom:any                 = new JSDOM(html)
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
          const r       = new RegExp(decodeURIComponent(self.params.q.replace(/\+/g, ' ')), "gi")
          if(t.match(r))
            founds.push(w)
        })
      })
      if(founds.length>0)
        html = self.wordsToHtml(founds, decodeURIComponent(self.params.q.replace(/\+/g, ' ')))
      else
        html = '<h2>Eztu topa ezer!</h2>'
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
        return false
  
      if(node_name===self.node_group_break)
      {
        i++
        words[i] = []
      }          
      words[i].push(c)
    })
    return words
  }

  wordsToHtml(words:Interfaces.Object, q:string):string
  {
    let html:string = ''
    const escaped         = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const r               = new RegExp(escaped, 'gi')
    const textNodeType    = 3
    const elementNodeType = 1

    const highlightTextNode = function(doc: Document, textNode: Text):void
    {
      const text = textNode.nodeValue || ''
      r.lastIndex = 0
      if(!r.test(text))
      {
        r.lastIndex = 0
        return
      }

      let match:      RegExpExecArray | null
      let lastIndex = 0
      const frag    = doc.createDocumentFragment()
      r.lastIndex   = 0

      while((match = r.exec(text)) !== null)
      {
        const before = text.slice(lastIndex, match.index)
        if(before)
          frag.appendChild(doc.createTextNode(before))

        const mark       = doc.createElement('mark')
        mark.textContent = match[0]
        frag.appendChild(mark)

        lastIndex = r.lastIndex
      }

      const after = text.slice(lastIndex)
      if(after)
        frag.appendChild(doc.createTextNode(after))

      if(textNode.parentNode)
        textNode.parentNode.replaceChild(frag, textNode)

      r.lastIndex = 0
    }

    const highlightElement = function(doc: Document, node: Node):void
    {
      Array.from(node.childNodes).forEach(function(child)
      {
        if(child.nodeType===textNodeType)
          highlightTextNode(doc, child as Text)

        else if(child.nodeType===elementNodeType)
          highlightElement(doc, child)
      })
    }

    words.forEach(function(w:HTMLElement[])
    {
      w.forEach(function(p:HTMLElement)
      {
        const doc: Document = (p.ownerDocument as Document) || new JSDOM('').window.document
        const el            = p.cloneNode(true) as HTMLElement
        highlightElement(doc, el)
        html += el.outerHTML
      })
    })
    return html
  }

  output(res:Interfaces.Object, html:string, q:string):void
  {
    let params:Interfaces.Object    = Constants
    params.LINK_HOME                = Constants.PUBLIC_ROOT+Constants.RELATIVE_ROOT    
    params.TITLE                    = `${params.SEARCH_CAPTION} ${q}`
    params.q                        = q

    html                            = View.load('./templates/header.jst', params)+
                                      View.load('./templates/search.jst', params)+
                                      html+
                                      View.load('./templates/footer.jst', Constants)

    Server.write(res, 200, html)
  }  
}