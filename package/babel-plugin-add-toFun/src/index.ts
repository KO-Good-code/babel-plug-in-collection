export default function ({types:t, template }) {
  return {
    visitor: {
      'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
        const bodyPath = path.get("body");
        const children = bodyPath.node.body;
        const childrenExpression = children.filter(child => child.type === "ExpressionStatement");
        if(childrenExpression.length && childrenExpression.find(child => child.expression?.callee?.name == state.opts.FunName)) {
          return false;
        }
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(state.FunAST);
        }
      },
      Program: {
        enter (path, state) {
          state.FunAST = template.statement(`${state.opts.FunName}()`)();
        }
      }
    }
  }
 }