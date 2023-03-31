import * as Interfaces  from './interfaces'
import * as fs          from 'fs'
import { View }         from './view'
import { JSDOM }        from 'jsdom'

const { execSync }  = require('child_process')
const Constants     = require('./constants')

export class Build
{
    constructor()
    {
        let self = this
        self.html()
        self.index()
        self.external()
    }

    index(): void {
        const dirs: string[] =
        [
            '../public/berbak-esamoldiek/'
        ]

        let result: Interfaces.Object = {}
        dirs.forEach(function (dir)
        {
            let files: string[] = fs.readdirSync(dir)
            files = files.filter(function(f)
            {
                if (f.match(/[a-z]{1}\.html$/))
                    return true
                return false
            })

            files.forEach(function(f)
            {
                const filename = dir + f
                const m: any = filename.match(/([^\/]+)\/([^\/]+)\.html$/i)
                if (m !== null)
                {
                    const d: string = m[1]
                    result[d] = result[d] || []

                    result[d].push(
                    {
                        'link': m[0],
                        'word': m[2]
                    })
                }
            })
        })

        let params: Interfaces.Object   = Constants
        params.LINK_HOME                = Constants.PUBLIC_ROOT + Constants.RELATIVE_ROOT


        let html: string =  View.load('./templates/header.jst', params)+
                            View.load('./templates/search.jst', { q: '' })+
                            View.load('./templates/index.jst', { result: result })+
                            View.load('./templates/footer.jst', Constants)

        fs.writeFileSync('../public/index.html', html, 'utf-8')
    }

    html(): void
    {
        let self = this
        self.deleteResources()

        // create folder
        execSync('mkdir -p ../public/berbak-esamoldiek/')

        // markdown dir list
        const md_dirs: string[] =
        [
            fs.realpathSync('../../berbak-esamoldiek')
        ]

        // markdown files list
        const md_files = self.getFiles(md_dirs,
        [
            /\.md$/i
        ])

        // Web-erako Heading-ak aldatuko ditugu ## (H2) -> ### (H3) eta # (H1) -> ## (H2) bihurtuz
        md_files.forEach(function (md)
        {
            let m = md.match(/([^\/]+)\.md$/)
            if (m !== null)
            {
                const tmp_md: string    = md.replace(/berbak\-esamoldiek/, 'web/public/berbak-esamoldiek')
                const file_html: string = tmp_md.replace(/\.md$/, '.html')
                let tmp_content: string =   fs.readFileSync(md, { encoding: 'utf8', flag: 'r' })
                                            .replace(/##\s+([^#]+)\s+##\s*\n/g, "### $1 ###\n\n")
                                            .replace(/#\s+([^#]+)\s+#\s*\n/g, "## $1 ##\n\n")

                fs.writeFileSync(tmp_md, tmp_content)

                let params: Interfaces.Object   = Constants
                params.LINK_HOME                = '../'

                const command: string           = `pandoc -f markdown -t html5 ${tmp_md}`
                let html: string                = execSync(command).toString()
                html                            =   View.load('./templates/header.jst', params)+
                                                    html+
                                                    View.load('./templates/footer.jst', Constants)
                html                            = self.anchor(html)

                fs.writeFileSync(file_html, html)

                execSync(`rm -rf ${tmp_md}`)
            }
        })
    }

    getFiles(dirs: string[], allow: RegExp[] = []): string[]
    {
        let files: string[] = []
        dirs.forEach(function (dir)
        {
            let f = fs.readdirSync(dir)

            f.forEach(function(g)
            {
                if(allow.length > 0)
                {
                    allow.forEach(function (a)
                    {
                        if(g.match(a))
                            files.push(`${dir}/${g}`)
                    })
                }
                else
                    files.push(`${dir}/${g}`)
            })
        })
        return files
    }

    anchor(html: string): string
    {
        let dom: any = new JSDOM(html)
        dom.window.document.querySelectorAll('h3').forEach(function (e: HTMLHeadingElement)
        {
            let word: string    = e.innerHTML
            const id: string    = e.getAttribute('id') || ''

            let a               = dom.window.document.createElement('a')
            a.setAttribute('href', "#" + id)
            a.appendChild(dom.window.document.createTextNode(word))

            while (e.hasChildNodes())
                e.removeChild(e.childNodes[0])

            e.appendChild(a)
        })
        return dom.serialize()
    }

    deleteResources(): void
    {
        let to_delete: string[] = []

        let resources: string[] =
        [
            '../public/index.html',
            '../public/berbak-esamoldiek/'
        ]

        resources.forEach(function(r)
        {
            try
            {
                to_delete.push(fs.realpathSync(r))
            }
            catch (e){}
        })

        to_delete.forEach(function(td)
        {
            let command: string = `rm -rf ${td}`
            execSync(command)
        })
    }

    external(): void
    {
        let self = this

        const md_dirs: string[] =
        [
            fs.realpathSync('../../'),
            fs.realpathSync('../../sarrerie'),
            fs.realpathSync('../../berbak-esamoldiek')
        ]
        const md_files = self.getFiles(md_dirs,
        [
            /\.md$/i
        ])

        let all: string = ''
        md_files.forEach(function(md)
        {
            all = `${all}\n${fs.readFileSync(md, { encoding: 'utf8', flag: 'r' })}\n\pagebreak\n`
        })
        fs.writeFileSync('../public/resources/full.md', all, 'utf-8')

        let command = `rm -rf ../public/resources/bermiotarra.pdf`
        execSync(command)

        command     = `rm -rf ../public/resources/bermiotarra.epub`
        execSync(command)

        command     = `pandoc ../public/resources/full.md -f markdown -t latex -o ../public/resources/bermiotarra.pdf`
        execSync(command)

        command     = `pandoc ../public/resources/full.md -f markdown -t epub -o ../public/resources/bermiotarra.epub --metadata title=Bermiotarra`
        execSync(command)

        command     = `rm -rf ../public/resources/full.md`
        execSync(command)
    }
}