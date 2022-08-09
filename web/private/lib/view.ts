import * as fs from 'fs'

export class View
{
    static load(file:string, params:object = {}, encoding:string = 'utf-8'):string
    {
        try
        {
            const options:object = {encoding: encoding}
            return (function(__params:object, __options:object):string
            {
                return eval("`"+fs.readFileSync(file, __options)+"`")
            })(params, options)
        }
        catch(e)
        {
            console.error("Error View.load - file: "+file)
            console.error(e)
            return ''
        }        
    }
}  