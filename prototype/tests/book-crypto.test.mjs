import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {deriveBookKey,seal,unseal,unlockBook,decryptBook,to64,ITERATIONS,CHECK_TEXT,validateBook} from '../src/book-crypto.js';
import {encryptBooks} from '../scripts/encrypt-books.mjs';
test('native encryption rejects wrong passwords, tampering and reordered chunks',async()=>{
 const salt=to64(randomBytes(16)),id=randomBytes(16).toString('hex'),key=await deriveBookKey('test-only-long-password',salt);
 const source=new TextEncoder().encode('%PDF-test sample'),part=await seal(key,id,0,source),check=await seal(key,id,'check',new TextEncoder().encode(CHECK_TEXT));
 const book={version:1,iterations:ITERATIONS,id,salt,size:source.length,parts:[{path:`${id}/0.bin`,iv:part.iv}],check:{iv:check.iv,data:to64(check.bytes)}};
 assert.equal(key.extractable,false);assert.deepEqual(new Uint8Array(await unseal(await unlockBook(book,'test-only-long-password'),id,0,part.iv,part.bytes)),source);
 await assert.rejects(unlockBook(book,'wrong password'));await assert.rejects(unseal(key,id,1,part.iv,part.bytes));part.bytes[0]^=1;await assert.rejects(unseal(key,id,0,part.iv,part.bytes));
 assert.throws(()=>validateBook({...book,parts:[{path:'https://external.invalid/file',iv:part.iv}]}));
});
test('local packer produces only ciphertext and browser can reconstruct exact PDF',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'zhixu-crypto-test-'));const originalFetch=globalThis.fetch;
 try{const source=Buffer.from('%PDF-1.7\nSample for test only\n%%EOF');const input=path.join(dir,'sample.pdf'),output=path.join(dir,'encrypted');await writeFile(input,source);await encryptBooks([input],'another-test-only-passphrase',output);
 const {books:[book]}=JSON.parse(await readFile(path.join(output,'catalog.json'),'utf8'));assert.ok(!JSON.stringify(book).includes('another-test-only-passphrase'));
 const encrypted=await readFile(path.join(output,book.parts[0].path));assert.ok(!encrypted.includes(source));
 globalThis.fetch=async url=>new Response(await readFile(path.join(output,url.replace('/books/',''))));
 const key=await unlockBook(book,'another-test-only-passphrase');const result=await decryptBook(book,key,'/books/',new AbortController().signal);assert.deepEqual(Buffer.from(await result.arrayBuffer()),source);
 const controller=new AbortController();controller.abort();await assert.rejects(decryptBook(book,key,'/books/',controller.signal));
 await assert.rejects(encryptBooks([input],'another-test-only-passphrase',output),/already exists/);
 }finally{globalThis.fetch=originalFetch;await rm(dir,{recursive:true,force:true});}
});
