import test from 'node:test';
import assert from 'node:assert/strict';
import {methods,volumes,recommendMethods} from '../src/mao-content.js';
test('five volumes have complete original study exercises',()=>{assert.equal(volumes.length,5);for(const v of volumes)assert.ok(methods.some(m=>m.volume===v.id));assert.equal(new Set(methods.map(m=>m.id)).size,methods.length);for(const m of methods)for(const key of ['title','explanation','question','example','task','boundary','source'])assert.ok(m[key]);});
test('recommendations do not fabricate matches',()=>{assert.equal(recommendMethods('zzzzzz').length,0);assert.ok(recommendMethods('英语').length);assert.ok(recommendMethods('会议').some(m=>m.title==='党委会的工作方法'));});
