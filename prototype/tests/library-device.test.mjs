import test from 'node:test';import assert from 'node:assert/strict';
import {DEVICE_KEY,readDevice,rememberDevice,forgetDevice} from '../src/library-device.js';
const store=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
test('remember restores authorization and forget removes it',()=>{const s=store();rememberDevice(s,'owner/private',' test-only ');assert.deepEqual(readDevice(s),{repo:'owner/private',token:'test-only'});forgetDevice(s);assert.equal(readDevice(s),null);});
test('corrupt and invalid device data are discarded',()=>{for(const value of ['{bad',JSON.stringify({version:1,repo:'https://evil.test',token:'x'})]){const s=store();s.setItem(DEVICE_KEY,value);assert.equal(readDevice(s),null);assert.equal(s.getItem(DEVICE_KEY),null);}});
test('blocked browser storage is not silently reported as remembered',()=>{assert.throws(()=>rememberDevice({setItem(){throw Error('blocked')}},'a/b','test'),/blocked/);});
