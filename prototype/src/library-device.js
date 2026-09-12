import {validRepo} from './private-library.js';
export const DEVICE_KEY='zhixu-private-library-device-v1';
// Explicitly opted-in browser storage; not encryption or protection from same-origin scripts.
export function readDevice(storage){const raw=storage.getItem(DEVICE_KEY);if(!raw)return null;try{const v=JSON.parse(raw);if(v.version===1&&validRepo(v.repo)&&typeof v.token==='string'&&v.token.trim())return {repo:v.repo,token:v.token};}catch{}storage.removeItem(DEVICE_KEY);return null;}
export function rememberDevice(storage,repo,token){if(!validRepo(repo)||!token.trim())throw Error('Invalid device authorization');storage.setItem(DEVICE_KEY,JSON.stringify({version:1,repo,token:token.trim()}));}
export function forgetDevice(storage){storage.removeItem(DEVICE_KEY);}
