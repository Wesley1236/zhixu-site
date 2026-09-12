import {useState} from 'react';
import {BookOpenText,NotePencil,GraduationCap,ChartLineUp,ArrowRight,MagnifyingGlass} from '@phosphor-icons/react';
import {useLocale} from './Locale';
export default function StudyHome({go}) {
 const {lang}=useLocale(),en=lang==='en'; const [query,setQuery]=useState('');
 const hour=new Date().getHours();
 return <section className="study-home">
  <div className="study-hero"><p className="study-kicker">KNOWLEDGE. INTO LIFE.</p><h1>{en?(hour<12?'Good morning,':hour<18?'Good afternoon,':'Good evening,'):(hour<12?'早上好，':hour<18?'下午好，':'晚上好，')}<br/><span>Wesley</span></h1><p>{en?'Stay curious. A smarter you, every day.':'保持好奇。让每一天，都有新的理解。'}</p>
  <form className="home-search" onSubmit={e=>{e.preventDefault();sessionStorage.setItem('zhixu-library-query',query);go('library');}}><MagnifyingGlass size={24}/><input aria-label={en?'Search your library':'搜索我的书库'} placeholder={en?'Search your books…':'搜索书名，开始一次精读……'} value={query} onChange={e=>setQuery(e.target.value)}/><button aria-label={en?'Search':'搜索'}><ArrowRight size={23}/></button></form></div>
  <div className="home-portals">{[[BookOpenText,'library','Library','我的书库','Organize & explore','收藏、阅读，让知识彼此连接'],[NotePencil,'notes','Write','记录想法','Capture your thoughts','留下你的理解，而不只是摘抄'],[GraduationCap,'explore','Learn','每日学习','Grow with practice','精读、听说，让练习成为日常'],[ChartLineUp,'review','Progress','成长轨迹','See your journey','回看小小进步，找到下一个方向']].map(([Icon,id,label,zh,detail,cn],i)=><button key={id} className={`home-portal portal-${i}`} onClick={()=>go(id)}><Icon size={36} weight="duotone"/><strong>{en?label:zh}</strong><span>{en?detail:cn}</span><ArrowRight className="portal-arrow" size={20}/></button>)}</div>
  <p className="home-signature">{en?'A better you. Every day.':'每一点积累，都属于你。'}</p>
 </section>;
}
