// Native Web Crypto only. Passwords and non-extractable keys never enter browser storage.
export const ITERATIONS = 600000;
export const CHECK_TEXT = 'zhixu-book-v1';
const encoder = new TextEncoder();
export const aad = (id, index) => encoder.encode(`zhixu-v1:${id}:${index}`);
export const from64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const to64 = bytes => btoa(String.fromCharCode(...bytes));
export async function deriveBookKey(password, salt) {
 const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt:from64(salt),iterations:ITERATIONS,hash:'SHA-256'}, material, {name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
}
export async function seal(key, id, index, bytes) {
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(id,index),tagLength:128},key,bytes);
 return {iv:to64(iv), bytes:new Uint8Array(encrypted)};
}
export async function unseal(key, id, index, iv, bytes) {
 return crypto.subtle.decrypt({name:'AES-GCM',iv:from64(iv),additionalData:aad(id,index),tagLength:128},key,bytes);
}
export function validateBook(book) {
 if(book.version!==1||book.iterations!==ITERATIONS||!/^[a-f0-9]{32}$/.test(book.id)||from64(book.salt).length!==16||!book.check||!Array.isArray(book.parts)||!book.parts.length||book.parts.length>64||!Number.isSafeInteger(book.size)||book.size<5||book.size>300*1024*1024)throw Error('Invalid encrypted book');
 if(book.parts.some((p,i)=>p.path!==`${book.id}/${i}.bin`||from64(p.iv).length!==12)||from64(book.check.iv).length!==12)throw Error('Invalid encrypted parts');
 return book;
}
export async function unlockBook(book,password) {
 validateBook(book);
 const key=await deriveBookKey(password,book.salt);
 const bytes=await unseal(key,book.id,'check',book.check.iv,from64(book.check.data));
 if(new TextDecoder().decode(bytes)!==CHECK_TEXT)throw Error('Invalid book check');
 return key;
}
export async function decryptBook(book,key,base,signal,onProgress=()=>{}) {
 const chunks=[];let size=0;
 for(let i=0;i<book.parts.length;i++){
  signal?.throwIfAborted();const part=book.parts[i];
  const response=await fetch(base+part.path,{signal});
  if(!response.ok)throw Error(`Download failed (${response.status})`);
  const bytes=await unseal(key,book.id,i,part.iv,await response.arrayBuffer());
  signal?.throwIfAborted();chunks.push(bytes);size+=bytes.byteLength;onProgress(i+1,book.parts.length);
 }
 if(size!==book.size)throw Error('Incomplete book');
 const blob=new Blob(chunks,{type:'application/pdf'});
 if(new TextDecoder().decode(await blob.slice(0,5).arrayBuffer())!=='%PDF-')throw Error('Invalid PDF');
 return blob;
}
