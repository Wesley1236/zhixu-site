import {open,mkdir,writeFile,rename,access} from 'node:fs/promises';
import path from 'node:path';
import {randomBytes,createHash} from 'node:crypto';
import {deriveBookKey,seal,unseal,to64,ITERATIONS,CHECK_TEXT} from '../src/book-crypto.js';
export async function encryptBooks(files,password,output,onProgress=()=>{}) {
 // Never overwrite an existing encrypted library; rekeying requires a new destination.
 try{await access(output);throw Error('Output already exists; choose a new destination.');}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const file of files)await access(file);
 await mkdir(output,{recursive:true});const books=[];
 for(const file of files){
  const handle=await open(file,'r');const id=randomBytes(16).toString('hex'),salt=to64(randomBytes(16));
  try{
   const {size}=await handle.stat();if(size>300*1024*1024)throw Error('Book exceeds 300 MB');
   const header=Buffer.alloc(5);await handle.read(header,0,5,0);if(header.toString()!=='%PDF-')throw Error('Invalid PDF source');
   const key=await deriveBookKey(password,salt),parts=[],hash=createHash('sha256');await mkdir(path.join(output,id));
   for(let position=0;position<size;){
    const buffer=Buffer.alloc(Math.min(8*1024*1024,size-position));const {bytesRead}=await handle.read(buffer,0,buffer.length,position);if(bytesRead!==buffer.length)throw Error('Incomplete source read');
    hash.update(buffer);const i=parts.length,encrypted=await seal(key,id,i,buffer);
    const verified=await unseal(key,id,i,encrypted.iv,encrypted.bytes);if(!Buffer.from(verified).equals(buffer))throw Error('Encryption verification failed');
    await writeFile(path.join(output,id,`${i}.bin`),encrypted.bytes,{flag:'wx'});parts.push({path:`${id}/${i}.bin`,iv:encrypted.iv});position+=bytesRead;buffer.fill(0);
   }
   const check=await seal(key,id,'check',new TextEncoder().encode(CHECK_TEXT));
   books.push({version:1,iterations:ITERATIONS,id,salt,size,legacyId:hash.digest('hex'),title:path.basename(file).replace(/\.pdf$/i,''),filename:path.basename(file),parts,check:{iv:check.iv,data:to64(check.bytes)}});
   onProgress(books.length,files.length);
  }finally{await handle.close();}
 }
 await writeFile(path.join(output,'catalog.tmp'),JSON.stringify({version:1,books}));await rename(path.join(output,'catalog.tmp'),path.join(output,'catalog.json'));
 return books.length;
}
