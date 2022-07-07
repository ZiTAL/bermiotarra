import * as fs from 'fs'

export class View
{
    static load(file:string, params:object, charset:string = 'utf-8'):string
    {
        console.log(charset)
        try
        {
            return (function(__params:object)
            {
                return eval("`"+fs.readFileSync(file, charset)+"`")
            })(params)
        }
        catch(e)
        {
            console.error("Error View.load - file: "+file)
            console.error(e)
            return ''
        }
    }
}  