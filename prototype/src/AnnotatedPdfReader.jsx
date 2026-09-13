import {useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {selectionRect} from './reading-annotations';
GlobalWorkerOptions.workerSrc=workerUrl;
export default function AnnotatedPdfReader({url,page,onPage,en,annotations,onAdd}){
 const [doc,setDoc]=useState(null),[error,setError]=useState(''),[text,setText]=useState(''),[width,setWidth]=useState(0),[zoom,setZoom]=useState(1),[theme,setTheme]=useState('paper'),[tool,setTool]=useState('read'),[draft,setDraft]=useState(null),[loading,setLoading]=useState(true),[quote,setQuote]=useState('');
 const canvas=useRef(null),container=useRef(null),frame=useRef(null),start=useRef(null),lastPage=useRef(page),pageChange=useRef(onPage);pageChange.current=onPage;
 useEffect(()=>{const observer=new ResizeObserver(([e])=>setWidth(e.contentRect.width));observer.observe(container.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{let active=true;setDoc(null);setError('');setLoading(true);const base=import.meta.env.BASE_URL;const task=getDocument({url,isEvalSupported:false,cMapUrl:base+'cmaps/',cMapPacked:true,standardFontDataUrl:base+'standard_fonts/',wasmUrl:base+'wasm/'});task.promise.then(pdf=>{if(active)setDoc(pdf);}).catch(e=>{if(active){setError(e.message);setLoading(false);}});return()=>{active=false;task.destroy();};},[url]);
 useEffect(()=>{
  if(!doc||!width)return;let active=true,render;setLoading(true);setError('');setDraft(null);start.current=null;setQuote('');setText('');const p=Math.min(Math.max(page,1),doc.numPages);if(p!==page){pageChange.current(p);return;}
  doc.getPage(p).then(async pdf=>{
   const cssWidth=Math.max(180,width-32)*zoom,view=pdf.getViewport({scale:1});const scale=Math.min(Math.min(2,devicePixelRatio||1)*cssWidth/view.width,4096/Math.max(view.width,view.height));const scaled=pdf.getViewport({scale});if(!active)return;
   const buffer=document.createElement('canvas');buffer.width=Math.ceil(scaled.width);buffer.height=Math.ceil(scaled.height);render=pdf.render({canvasContext:buffer.getContext('2d'),viewport:scaled});await render.promise;if(!active)return;
   const c=canvas.current;c.width=buffer.width;c.height=buffer.height;c.getContext('2d').drawImage(buffer,0,0);frame.current.style.width=cssWidth+'px';
   const direction=p>=lastPage.current?1:-1;lastPage.current=p;setLoading(false);
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches){frame.current.getAnimations().forEach(a=>a.cancel());frame.current.animate([{opacity:.35,transform:`perspective(1200px) translateX(${direction*14}px) rotateY(${direction*5}deg)`},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.75,.25,1)'});}
   const content=await pdf.getTextContent();if(active)setText(content.items.map(x=>x.str||'').join(' '));
  }).catch(e=>{if(active&&e.name!=='RenderingCancelledException'){setError(e.message);setLoading(false);}});return()=>{active=false;render?.cancel();};
 },[doc,page,width,zoom]);
 const turn=p=>{if(doc){pageChange.current(Math.min(doc.numPages,Math.max(1,p)));container.current.scrollTop=0;}};
 const point=e=>{const r=frame.current.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};};
 const down=e=>{if(tool==='read'||loading||e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);start.current=point(e);setDraft(selectionRect(start.current,start.current));};
 const move=e=>{if(start.current)setDraft(selectionRect(start.current,point(e)));};
 const up=e=>{if(!start.current)return;const rect=selectionRect(start.current,point(e));start.current=null;setDraft(null);if(rect.w>.005&&rect.h>.002)onAdd({page,type:tool,rect});};
 return <div className={`pdf-renderer paper-${theme}`} ref={container}>
  <div className="reading-settings"><label>{en?'Paper':'纸张'} <select value={theme} onChange={e=>setTheme(e.target.value)}><option value="paper">{en?'Warm':'暖纸'}</option><option value="white">{en?'White':'白纸'}</option><option value="night">{en?'Night':'夜读'}</option></select></label><label>{en?'Zoom':'缩放'} <select value={zoom} onChange={e=>setZoom(Number(e.target.value))}>{[1,1.25,1.5,2].map(z=><option key={z} value={z}>{z*100}%</option>)}</select></label></div>
  <div className="annotation-tools" aria-label={en?'Annotation tools':'标注工具'}>{[['read','阅读','Read'],['highlight','高亮','Highlight'],['underline','划线','Underline'],['thought','想法','Thought']].map(([id,zh,english])=><button key={id} aria-pressed={tool===id} onClick={()=>setTool(id)}>{en?english:zh}</button>)}</div>
  <p className="annotation-hint">{tool==='read'?(en?'Scroll to read. For scans, choose a tool and drag a region.':'滚动阅读；扫描页可选择工具后拖动框选标注。'):(en?'Drag across a region. Switch to Read to scroll on mobile.':'在原页上拖动框选；手机滚动时请切回“阅读”。')}</p>
  <div className="pdf-pagination"><button disabled={!doc||page<=1} onClick={()=>turn(page-1)}>{en?'Previous':'上一页'}</button><label><input aria-label={en?'Page number':'跳转页码'} type="number" min="1" max={doc?.numPages||1} value={page} disabled={!doc} onChange={e=>turn(Number(e.target.value)||1)}/> / {doc?.numPages||'…'}</label><button disabled={!doc||page>=doc.numPages} onClick={()=>turn(page+1)}>{en?'Next':'下一页'}</button></div>
  {loading&&<p role="status">{en?'Preparing page…':'正在准备书页…'}</p>}{error&&<p role="alert">{error}</p>}
  <div className="annotated-page" ref={frame} style={{opacity:loading?0:1,pointerEvents:loading?'none':'auto'}}><canvas ref={canvas} aria-label={en?`PDF page ${page}`:`原书第 ${page} 页`}/><svg className="page-annotations" viewBox="0 0 100 100" preserveAspectRatio="none" style={{touchAction:tool==='read'?'auto':'none',pointerEvents:tool==='read'?'none':'auto'}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{start.current=null;setDraft(null);}} aria-hidden="true">{[...annotations.filter(a=>a.page===page&&a.rect),...(draft?[{id:'draft',type:tool,rect:draft}]:[])].map(a=>a.type==='underline'?<line key={a.id} x1={a.rect.x*100} x2={(a.rect.x+a.rect.w)*100} y1={(a.rect.y+a.rect.h)*100} y2={(a.rect.y+a.rect.h)*100} stroke="#d87632" strokeWidth=".35"/>:<rect key={a.id} x={a.rect.x*100} y={a.rect.y*100} width={a.rect.w*100} height={a.rect.h*100} fill={a.type==='thought'?'#78b8dd55':'#f5c84b66'} stroke={a.type==='thought'?'#368db3':'none'} strokeWidth=".2"/>)}</svg></div>
  {doc&&<details className="page-text"><summary>{en?'Accessible page text':'本页文字 / 辅助阅读'}</summary><p onPointerUp={()=>setQuote(window.getSelection()?.toString().trim().slice(0,4000)||'')}>{text||(en?'Scanned page: no selectable text. Use region annotation above.':'扫描页没有可选文字，请使用上方框选标注。')}</p>{text&&<><label>{en?'Quote (select or type)':'摘录（可选择文字或输入）'}<textarea value={quote} maxLength={4000} onChange={e=>setQuote(e.target.value)}/></label><button disabled={!quote.trim()} onClick={()=>{onAdd({page,type:'thought',quote});setQuote('');}}>{en?'Save quote & thought':'保存摘录并写想法'}</button></>}</details>}
 </div>;
}
