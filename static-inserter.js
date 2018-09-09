const fs=require('fs')
const path=require('path')
const winston = require("winston")
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logfile.log', maxsize: "1M" })
    ]
  });

function readHtml(className) {
    let fileName='./'+className+'.html'
    if(!fs.existsSync(fileName)) {
        throw new Error("HTML file for the component not found.")
    }
    logger.log("info", `HTML file (${fileName}) for the component found.`)
    return fs.readFileSync(fileName)
            .toString()
            .split(new RegExp('\r?\n'))
            .map(line=>line.trim())
            .join('')
}

function readCss(className) {
    let fileName='./'+className+'.css'
    if(!fs.existsSync(fileName)) {
        throw new Error("CSS file for the component not found.")
    }
    logger.log("info", `CSS file (${fileName}) for the component found.`)
    let css=fs.readFileSync(fileName)
            .toString()
            .split(new RegExp('\r?\n'))
            .map(line=>line.trim())
            .join('')
    return `<style>${css}</style>`
}

module.exports = function(babel) {
    var t = babel.types;
    
    function prepareHTMLFunction(className) {
        let content=''
        content+=readHtml(className)
        try {
        content+=readCss(className)
        } catch (err) {
            logger.log('info', `Optional ./${className}.css not found, so neglecting css file.`)    
        }
        let stringLiteral=t.stringLiteral(content)
        let returnStatement=t.returnStatement(stringLiteral)
        let blockStatement=t.blockStatement([returnStatement])
        let classMethod=t.classMethod("get", t.identifier("template"), [], blockStatement, false, true)
        return classMethod
    }

    return {
        visitor: {
            ClassDeclaration: function(path) {
                console.log(path.decorators)
                if(path.node.superClass!=null && path.node.superClass.name=="HTMLElement") {
                    let superClassName=path.node.superClass.name
                    let className=path.node.id.name
                    let found=path.node.body.body.find(block=>block.key.name=='template')
        
                    if(!found) {
                        logger.log('info', `Template method not found, checking for ${className}.html [required] and ${className}.css [optional] files.`)
                        try {
                            path.node.body.body.push(prepareHTMLFunction(className))
                            logger.log("info", `Completed creation of template method for the component.`)
                        } catch(err) {
                            logger.log("error", `Required ./${className}.html not found.`)
                            logger.log("error", `Failed creation of template method for the component.`)
                        }
                    } else {
                        if(found.kind!='get' || found.static!=true) {
                            throw new Error("The template method signature incorrect, template method should be a static getter.")
                        }
                    }
                }
            }
        }
    };
};