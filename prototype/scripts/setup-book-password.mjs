// Local-only, one-shot password intake. No logging, persistence, or transmission to GitHub.
import http from 'node:http';
import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {encryptBooks} from './encrypt-books.mjs';
import {sourceDirectory,names} from './book-sources.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'public','encrypted-books');
for(const name of names)await access(path.join(sourceDirectory,name));
const csrf=randomBytes(32).toString('hex');let phase='ready',finished=0;
const server=http.createServer(async(req,res)=>{
 const origin=`http://127.0.0.1:${server.address().port}`;
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'");
 if(req.headers.host!==origin.slice(7)){res.writeHead(403).end();return;}
 if(req.method==='GET'&&req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end((await readFile(path.join(root,'scripts','setup-book-password.html'),'utf8')).replace('__CSRF__',csrf));return;}
 if(req.method==='GET'&&req.url==='/status'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({phase,finished,total:names.length}));return;}
 if(req.method!=='POST'||req.url!=='/encrypt'||req.headers.origin!==origin||req.headers['x-setup-token']!==csrf||req.headers['content-type']!=='application/json'||phase!=='ready'){res.writeHead(403).end();return;}
 let raw='';try{
  for await(const bytes of req){raw+=bytes;if(raw.length>4096)throw Error('Too large');}
  const value=JSON.parse(raw);raw='';let password=value.password;value.password='';
  if(typeof password!=='string'||password!==value.confirm||password.length<16||password.length>256||/^\d+$/.test(password)){res.writeHead(400).end('Use a matching passphrase of 16–256 characters, not digits only.');return;}
  value.confirm='';phase='encrypting';res.writeHead(202).end('started');
  try{await encryptBooks(names.map(name=>path.join(sourceDirectory,name)),password,output,n=>finished=n);phase='complete';console.log('Encrypted 13 books; verified every chunk. Ready for deployment.');}catch{phase='failed';console.error('Encryption failed. No complete catalog published. Check source access/output directory.');}finally{password='';}
 }catch{if(!res.headersSent)res.writeHead(400).end('Invalid request');}
});
server.listen(0,'127.0.0.1',()=>console.log(`Local password setup: http://127.0.0.1:${server.address().port}/`));
setTimeout(()=>server.close(),60*60*1000).unref();
