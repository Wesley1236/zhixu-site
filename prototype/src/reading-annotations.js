export function selectionRect(a,b){
 const clamp=n=>Math.max(0,Math.min(1,n));
 const x=clamp(Math.min(a.x,b.x)),y=clamp(Math.min(a.y,b.y));
 return {x,y,w:clamp(Math.max(a.x,b.x))-x,h:clamp(Math.max(a.y,b.y))-y};
}
export function normalizeNote(value={}){
 return {...value,page:Math.max(1,Math.floor(Number(value.page)||1)),notes:typeof value.notes==='string'?value.notes:'',annotations:Array.isArray(value.annotations)?value.annotations.filter(a=>a&&typeof a.id==='string'&&Number.isInteger(a.page)&&a.page>0&&['highlight','underline','thought'].includes(a.type)).slice(0,2000):[]};
}
export function exportReading(title,note){return `# ${title}\n\nPDF ${note.page}\n\n${note.notes}\n\n## 标注 / Annotations\n\n`+(note.annotations||[]).map(a=>`- PDF ${a.page} · ${a.type}\n  ${a.quote||''}\n  ${a.thought||''}${a.rect?'\n  Region (normalized): '+JSON.stringify(a.rect):''}`).join('\n\n');}
