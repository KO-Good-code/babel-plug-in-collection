// import * as template from "babel-template";
const template = require("babel-template");

export const tryCatchAst = template(`
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
export const catchConsole:Function = (filePath:string, funcName:string, customLog:string = '输出错误') => `
filePath: ${filePath}
funcName: ${funcName}
${customLog}:`;

// 默认配置
export const defaultOptions = {
  customLog: 'Error',
  exclude: ['node_modules'],
  include: []
}

// 对比文件
export function ReferenceDocuments(fileLst:Array<string>, filename:string):boolean {
  return fileLst && fileLst.find(name => name && filename.includes(name)) !== undefined;
}
