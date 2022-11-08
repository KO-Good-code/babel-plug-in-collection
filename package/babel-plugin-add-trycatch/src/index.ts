import { tryCatchAst, catchConsole, defaultOptions, ReferenceDocuments } from './common/utils'

export default function ({types:t, template }) { 
  return {
    visitor: {
      'ObjectMethod|ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
        if(path.findParent(p => p.isTryStatement())) {
          return false;
        }
        const filePath = this.filename || this.file.opts.filename || 'unknown';
        const node = path.node;
        let methodName:string;
        let bodyPath = path.get("body");
        const options = Object.assign(defaultOptions, this.opts);
        if(ReferenceDocuments(options.exclude, filePath)) {
          return false;
        }
        if(options.includes?.length > 0 && !ReferenceDocuments(options.includes, filePath)) {
          return false;
        }
        switch(node.type) {
          case 'ArrowFunctionExpression' :
          case 'FunctionExpression':
            let identifier = path.getSibling('id');
            methodName = identifier?.node?.name;
            break;
          case 'FunctionDeclaration' :
            methodName = node.id?.name;
            break;
          case 'ClassMethod':
          case 'ObjectMethod':
            methodName = node.key?.name;
            break;
        }
        const tempArgumentObj  = {
          CatchError: t.stringLiteral(catchConsole(filePath, methodName))
        }
        let tryNode = tryCatchAst(tempArgumentObj);
        let info = bodyPath.node.body;
        if(info) {
          tryNode.block.body.push(...info);
        }
        bodyPath.node.body = [tryNode]
      }
    }
  }
 }