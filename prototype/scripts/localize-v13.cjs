const fs=require('fs'),parser=require('@babel/parser'),traverse=require('@babel/traverse').default,t=require('@babel/types'),generate=require('@babel/generator').default;
for(const name of ['LearningStudio','OrbitHome','MaoStudy','ExpressionTraining','App']){
 const file=`src/${name}.jsx`;let source=fs.readFileSync(file,'utf8');if(source.includes("from './Locale'"))continue;
 const ast=parser.parse(source,{sourceType:'module',plugins:['jsx']});
 traverse(ast,{ReturnStatement(path){if(t.isJSXElement(path.node.argument)||t.isJSXFragment(path.node.argument)){path.node.argument=t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('Localize'),[]),t.jsxClosingElement(t.jsxIdentifier('Localize')),[path.node.argument]);path.skip()}}});
 fs.writeFileSync(file,"import {Localize} from './Locale';\n"+generate(ast,{retainLines:true},source).code+'\n');
}
