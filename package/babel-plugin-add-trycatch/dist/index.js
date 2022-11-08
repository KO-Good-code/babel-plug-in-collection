'use strict';

// import * as template from "babel-template";
const template = require("babel-template");
const tryCatchAst = template(`
  try{

  }catch(e) {
    console.log(CatchError, e);
  }
`);
/*
 * catch要打印的信息
 * @param {string} filePath - 当前执行文件的路径
 * @param {string} funcName - 当前执行方法的名称
 * @param {string} customLog - 用户自定义的打印信息
 */
const catchConsole = (filePath, funcName, customLog = '输出错误') => `
filePath: ${filePath}
funcName: ${funcName}
${customLog}:`;
// 默认配置
const defaultOptions = {
    customLog: 'Error',
    exclude: ['node_modules'],
    include: []
};
// 对比文件
function ReferenceDocuments(fileLst, filename) {
    return fileLst && fileLst.find(name => name && filename.includes(name)) !== undefined;
}

function index ({ types: t, template }) {
    return {
        visitor: {
            'ObjectMethod|ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
                if (path.findParent(p => p.isTryStatement())) {
                    return false;
                }
                const filePath = this.filename || this.file.opts.filename || 'unknown';
                const node = path.node;
                let methodName;
                let bodyPath = path.get("body");
                const options = Object.assign(defaultOptions, this.opts);
                if (ReferenceDocuments(options.exclude, filePath)) {
                    return false;
                }
                if (options.includes?.length > 0 && !ReferenceDocuments(options.includes, filePath)) {
                    return false;
                }
                switch (node.type) {
                    case 'ArrowFunctionExpression':
                    case 'FunctionExpression':
                        let identifier = path.getSibling('id');
                        methodName = identifier?.node?.name;
                        break;
                    case 'FunctionDeclaration':
                        methodName = node.id?.name;
                        break;
                    case 'ClassMethod':
                    case 'ObjectMethod':
                        methodName = node.key?.name;
                        break;
                }
                const tempArgumentObj = {
                    CatchError: t.stringLiteral(catchConsole(filePath, methodName))
                };
                let tryNode = tryCatchAst(tempArgumentObj);
                let info = bodyPath.node.body;
                if (info) {
                    tryNode.block.body.push(...info);
                }
                bodyPath.node.body = [tryNode];
            }
        }
    };
}

module.exports = index;
