// API credentials are supplied at runtime, never shipped in the public bundle.
export const DEFAULT_REPO='Wesley1236/zhixu-library-private';
export function validRepo(value){return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value);}
export function encode64(bytes){let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);}
export function createLibraryClient(repo,token){
 if(!validRepo(repo)||!token.trim())throw Error('请填写仓库名称与访问令牌 / Repository and token required');
 const root=`https://api.github.com/repos/${repo}`;
 async function request(path='',options={}){const response=await fetch(root+path,{...options,signal:AbortSignal.timeout(60000),headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28',...options.headers}});if(!response.ok){const err=Error(response.status===409?'远端已更新，请重新连接后再保存；你的本地草稿仍保留。 / Conflict: reconnect before saving.':`GitHub ${response.status}：请检查权限、网络或文件大小。`);err.status=response.status;throw err;}return response;}
 const filePath=p=>'/contents/'+p.split('/').map(encodeURIComponent).join('/');
 async function read(path){const r=await request(filePath(path),{headers:{Accept:'application/vnd.github.raw+json'}});return r;}
 async function sha(path){try{return (await (await request(filePath(path))).json()).sha;}catch(e){if(e.status===404)return undefined;throw e;}}
 async function put(path,content,expectedSha){return (await request(filePath(path),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update private reading library',content,...(expectedSha?{sha:expectedSha}:{})})})).json();}
 return {
  async verify(){const r=await(await request()).json();if(!r.private)throw Error('只允许私有仓库，已阻止连接公开仓库。 / Private repository required.');if(!r.permissions?.push)throw Error('需要此仓库的 Contents 读写权限。 / Write access required.');},
  async list(){try{const files=await(await request('/contents/books')).json();return await Promise.all(files.filter(f=>f.name.endsWith('.json')).map(async f=>JSON.parse(await(await read(f.path)).text())));}catch(e){if(e.status===404)return [];throw e;}},
  async upload(file){if(!/\.pdf$/i.test(file.name)||file.size>90*1024*1024)throw Error('请选择 90 MB 以内的 PDF；更大的扫描版请先拆分。');const bytes=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw Error('文件不是有效的 PDF。');const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');const path=`books/${hash}.pdf`;const book={id:hash,title:file.name.replace(/\.pdf$/i,''),filename:file.name,path,size:file.size};if(!await sha(path))await put(path,encode64(bytes));const meta=`books/${hash}.json`;await put(meta,encode64(new TextEncoder().encode(JSON.stringify(book))),await sha(meta));return book;},
  async download(book){if(book.parts){const blobs=[];for(const path of book.parts)blobs.push(await(await read(path)).blob());return new Blob(blobs,{type:'application/pdf'});}return new Blob([await(await read(book.path)).blob()],{type:'application/pdf'});},
  async note(id){const path=`notes/${id}.json`;const version=await sha(path);return version?{value:await(await read(path)).json(),sha:version}:{value:{page:1,notes:''},sha:null};},
  async saveNote(id,value,version){const result=await put(`notes/${id}.json`,encode64(new TextEncoder().encode(JSON.stringify(value))),version);return result.content.sha;}
 };
}
