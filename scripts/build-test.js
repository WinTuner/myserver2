const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, '..', 'Test', 'Test1.ts');
const out = path.join(__dirname, '..', 'dist', 'Test1.js');

let code = fs.readFileSync(src, 'utf8');
// Rewrite TS import to compiled JS location (dist/Utils.js)
code = code.replace(/from\s+['"]\.\.\/src\/Utils['"]/g, "from './Utils'");
code = code.replace(/require\(['"]\.\.\/src\/Utils['"]\)/g, "require('./Utils')");

// Strip types for this simple file: transpile via typescript if available
try {
  const ts = require('typescript');
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  fs.writeFileSync(out, js);
  console.log('Built dist/Test1.js');
} catch (e) {
  // Fallback: Test1.ts is simple enough that manual JS matches reference
  const fallback = `"use strict";
const { utils } = require('./Utils');
async function unit_test() {
  if (utils.add(2, 2) === 4) { } else { console.log('Test Failed: utils.add(2, 2) === 4'); process.exit(1); }
  if (utils.add(3, 3) === 6) { } else { console.log('Test Failed: utils.add(3, 3) === 6'); process.exit(1); }
  if (utils.add_user('test', 'testnoassigning', 'password') === false) { } else { console.log('UnitTest Case 3 failed'); process.exit(1); }
  console.log('All unit tests passed');
}
unit_test();
`;
  fs.writeFileSync(out, fallback);
  console.log('Built dist/Test1.js (fallback)');
}
