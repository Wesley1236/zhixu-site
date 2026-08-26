import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Pulse, Archive, ArrowCounterClockwise, ArrowRight, Bell, BookOpenText, Books,
  BookmarkSimple, Brain, CalendarDots, CaretDown, CaretRight, ChatCircle, Check,
  CheckCircle, CircleNotch, Clock, Code, Database, File, FileAudio, FileDoc,
  FileImage, FilePdf, FileText, FileVideo, FolderOpen, FolderSimple, Funnel,
  Heart, House, Lightning, ListBullets, MagnifyingGlass, NotePencil,
  PaperPlaneTilt, PencilSimple, Plus, PuzzlePiece, Robot, ShieldCheck,
  SlidersHorizontal, Sparkle, SquaresFour, Star, StarFour, Target, Timer, Trash,
  TrayArrowDown, TrendUp, UploadSimple, X,
} from "@phosphor-icons/react";
import { growthDomains, seedActions, seedKnowledge, spaces } from "./data.js";

const navItems = [
  { id: "dashboard", label: "总览", icon: House },
  { id: "library", label: "知识库", icon: Books },
  { id: "ai", label: "AI 智识", icon: Sparkle },
  { id: "goals", label: "目标与项目", icon: Target },
  { id: "strategy", label: "成长战略", icon: TrendUp },
  { id: "review", label: "复盘", icon: ArrowCounterClockwise },
];

const themeOptions = [
  { id: "aurora", label: "极光", icon: Sparkle },
  { id: "stars", label: "星图", icon: StarFour },
  { id: "quiet", label: "静谧", icon: Heart },
];

const iconByDomain = { Code, Robot, ChatCircle, BookOpenText, Heart };
const fileIcons = {
  pdf: FilePdf, doc: FileDoc, docx: FileDoc, ppt: FileDoc, pptx: FileDoc,
  xls: FileDoc, xlsx: FileDoc, png: FileImage, jpg: FileImage, jpeg: FileImage,
  webp: FileImage, mp4: FileVideo, mov: FileVideo, mp3: FileAudio,
  wav: FileAudio, md: FileText, txt: FileText,
};

const pageCopy = {
  dashboard: ["晚上好，Wesley", "今天最值得推进什么？"],
  library: ["知识库", "把收藏变成可调用、可复用的成长资产。"],
  ai: ["AI 智识", "从你的知识出发，回答、引用，再转化为行动。"],
  goals: ["目标与项目", "让每个目标都连接到清晰行动与成长证据。"],
  strategy: ["成长战略", "专业、技术、表达、输出与生活共同向前。"],
  review: ["每周复盘", "看见变化，修正方向，把经历沉淀成证据。"],
};

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* memory fallback */ }
  }, [key, value]);
  return [value, setValue];
}

function cx(...classes) { return classes.filter(Boolean).join(" "); }

function MagneticButton({ className = "", children, onClick, type = "button", ...props }) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.button type={type} className={cx("magnetic-button", className)}
      animate={offset} transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.45 }}
      onPointerMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({ x: (event.clientX - rect.left - rect.width / 2) * 0.08, y: (event.clientY - rect.top - rect.height / 2) * 0.08 });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })} onClick={onClick} {...props}>
      <span className="button-specular" /><span className="button-content">{children}</span>
    </motion.button>
  );
}

function GlassSurface({ className = "", children, as: Component = motion.section, ...props }) {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  return (
    <Component className={cx("glass-surface", className)} animate={tilt}
      transition={{ type: "spring", stiffness: 180, damping: 26 }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({ rotateX: ((event.clientY - rect.top) / rect.height - 0.5) * -0.8, rotateY: ((event.clientX - rect.left) / rect.width - 0.5) * 0.8 });
      }}
      onPointerLeave={() => setTilt({ rotateX: 0, rotateY: 0 })} {...props}>{children}</Component>
  );
}

function Sidebar({ page, setPage, theme, setTheme }) {
  return (
    <aside className="sidebar glass-surface-static">
      <button className="brand" onClick={() => setPage("dashboard")} aria-label="返回总览">
        <span className="brand-mark">知</span><span><strong>知序 <small>2.0</small></strong><em>个人成长智能 OS</em></span>
      </button>
      <nav className="primary-nav" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon; const active = page === item.id;
          return <button key={item.id} className={cx("nav-item", active && "active")} onClick={() => setPage(item.id)}>
            {active && <motion.span className="nav-lens" layoutId="nav-lens" />}
            <Icon size={21} weight={active ? "fill" : "regular"} /><span>{item.label}</span>
          </button>;
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="mini-theme-switch" aria-label="背景主题">
          {themeOptions.map((item) => { const Icon = item.icon; return <button key={item.id} className={cx(theme === item.id && "active")} onClick={() => setTheme(item.id)} title={item.label} aria-label={`切换到${item.label}背景`}><Icon size={16} weight={theme === item.id ? "fill" : "regular"} /></button>; })}
        </div>
        <button className="profile-chip"><span className="avatar">W</span><span><strong>Wesley</strong><small>持续进化中</small></span><CaretDown size={15} /></button>
      </div>
    </aside>
  );
}

function MobileNav({ page, setPage }) {
  return <nav className="mobile-nav glass-surface-static" aria-label="移动端导航">
    {navItems.slice(0, 5).map((item) => { const Icon = item.icon; const active = page === item.id; return <button key={item.id} className={cx(active && "active")} onClick={() => setPage(item.id)}><Icon size={20} weight={active ? "fill" : "regular"} /><span>{item.label.replace("目标与项目", "目标")}</span></button>; })}
  </nav>;
}

function TopBar({ page, setPage, openUpload, startFocus }) {
  const today = new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"2-digit", day:"2-digit", weekday:"long" }).format(new Date());
  return <header className="topbar">
    <div className="page-heading"><span className="date-line">{today}</span><h1>{pageCopy[page][0]}</h1><p>{pageCopy[page][1]}</p></div>
    <div className="top-actions">
      <MagneticButton className="secondary" onClick={() => setPage("ai")}><ChatCircle size={19} /><span>询问知识库</span></MagneticButton>
      <MagneticButton className="secondary" onClick={openUpload}><Plus size={19} /><span>快速捕获</span></MagneticButton>
      <MagneticButton className="primary" onClick={startFocus}><span>开始今日推进</span><ArrowRight size={19} /></MagneticButton>
    </div>
  </header>;
}

function GrowthConstellation({ activeDomain, setActiveDomain, startFocus }) {
  return <div className="constellation" aria-label="2026 成长主线">
    <div className="constellation-center"><span>2026</span><strong>成长主线</strong><p>构建复利成长系统<br />成为可持续创造价值的人</p></div>
    <div className="domain-grid">
      {growthDomains.map((domain) => {
        const Icon = iconByDomain[domain.icon]; const active = activeDomain === domain.id;
        return <motion.button layout key={domain.id} className={cx("domain-node", `tone-${domain.color}`, active && "active")} onClick={() => setActiveDomain(domain.id)} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <span className="node-icon"><Icon size={28} weight="duotone" /></span>
          <span className="node-copy"><strong>{domain.label}</strong><small>{domain.note}</small><span className="progress-track"><i style={{ width: `${domain.progress}%` }} /></span><em>本周进度 {domain.progress}%</em></span>
        </motion.button>;
      })}
    </div>
    <div className="knowledge-flow" aria-label="知识成长流">
      {[[TrayArrowDown,"捕获","收集与记录"],[BookOpenText,"理解","整理与消化"],[PuzzlePiece,"应用","实践与内化"],[NotePencil,"输出","表达与创造"],[Star,"成长证据","复盘与沉淀"]].map(([Icon,label,note], index) =>
        <div className="flow-stage" key={label}><motion.span className="flow-icon" animate={{ y: [0,-3,0] }} transition={{ duration: 2.8, delay: index * .22, repeat: Infinity }}><Icon size={24} weight="duotone" /></motion.span><strong>{label}</strong><small>{note}</small></div>)}
    </div>
    <GlassSurface className="today-focus" as={motion.div}>
      <div className="focus-title"><span>今日焦点</span><strong>完成个人 AI 编程作品的检索模块</strong></div>
      <div className="focus-facts"><span><CheckCircle size={17} /> 实现关键词向量检索</span><span><Clock size={17} /> 预计 90 分钟</span><span><FileText size={17} /> 检索模块实现文档</span></div>
      <button className="focus-play" onClick={startFocus} aria-label="开始今日焦点"><ArrowRight size={20} /></button>
    </GlassSurface>
  </div>;
}

function AnswerContent({ answer, onConvert, onSave, compact = false }) {
  return <>
    <div className="answer-mode"><Sparkle size={18} weight="fill" /><span>基于我的知识</span><CaretDown size={16} /></div>
    <div className="answer-body"><span className="eyebrow">综合分析结果</span><h3>{answer.title}</h3><p>{answer.body}</p></div>
    <div className="citation-block"><span className="eyebrow">关键依据</span>{answer.citations.map((item,index) => <button className="citation-row" key={`${item.id}-${index}`}><span className="citation-icon"><Database size={18} weight="duotone" /></span><span><strong>{item.title}</strong><small>{item.source}</small></span><CaretRight size={16} /></button>)}</div>
    <div className={cx("answer-actions", compact && "compact")}><MagneticButton className="primary" onClick={onConvert}><span>转为今日行动</span><ArrowRight size={18} /></MagneticButton><MagneticButton className="secondary" onClick={onSave}><BookmarkSimple size={18} /><span>保存为成长证据</span></MagneticButton></div>
  </>;
}

function makeAnswer(query, knowledge, scope) {
  const normalized = query.trim().toLowerCase();
  const tokens = normalized.replace(/[，。？！、,.?!:：；;]/g," ").split(/\s+/).filter((token) => token.length > 1);
  const pool = scope === "全部知识" ? knowledge : knowledge.filter((item) => item.space === scope);
  const scored = pool.map((item) => {
    const haystack = `${item.title} ${item.summary} ${item.content} ${item.tags.join(" ")}`.toLowerCase();
    return { ...item, score: tokens.reduce((total,token) => total + (haystack.includes(token) ? 3 : 0),0) + (item.favorite ? .5 : 0) };
  }).sort((a,b) => b.score - a.score || new Date(b.updatedAt) - new Date(a.updatedAt));
  const citations = scored.slice(0,3); const focus = citations[0] ?? knowledge[0];
  const evidence = citations.map((item) => item.summary.replace(/。$/,"")).join("；");
  return { title: normalized ? `先推进：${focus?.title.replace(/[《》]/g,"") || "建立知识素材"}` : "完成个人 AI 编程作品的检索模块", body: evidence ? `结合你在“${scope}”范围内的资料，最有价值的下一步是收敛范围、完成一个可验证成果。依据显示：${evidence}。建议先完成最小闭环，再记录取舍与结果。` : "当前范围内还没有足够内容。请先导入资料，或把知识范围切换到“全部知识”。", citations };
}

function AssistantPanel({ knowledge, onConvert, onSave, compact = true }) {
  const [scope, setScope] = useState("全部知识");
  const answer = useMemo(() => makeAnswer("今天最值得推进什么", knowledge, scope), [knowledge,scope]);
  return <GlassSurface className="assistant-panel">
    <div className="panel-title"><span><Sparkle size={20} weight="fill" /> AI 知识助手</span><ShieldCheck size={19} /></div>
    <label className="scope-select compact-select"><select value={scope} onChange={(event) => setScope(event.target.value)}>{spaces.filter((space) => space !== "收件箱").map((space) => <option key={space}>{space}</option>)}</select><CaretDown size={15} /></label>
    <AnswerContent answer={answer} onConvert={onConvert} onSave={onSave} compact={compact} />
  </GlassSurface>;
}

function RhythmDock({ theme, setTheme }) {
  const rhythms = [[ChatCircle,"英语表达","输出练习 20 分钟",60],[BookOpenText,"精读输出","《认知觉醒》读书笔记",40],[Pulse,"运动","力量训练 45 分钟",50]];
  return <GlassSurface className="rhythm-dock"><div className="dock-main"><span className="dock-title">今日成长节奏</span><div className="rhythm-list">{rhythms.map(([Icon,label,note,progress]) => <div className="rhythm-item" key={label}><span className="rhythm-icon"><Icon size={23} weight="duotone" /></span><span className="rhythm-copy"><strong>{label}</strong><small>{note}</small><span className="progress-track"><i style={{ width: `${progress}%` }} /></span></span><em>{progress}%</em></div>)}</div></div><div className="dock-themes">{themeOptions.map((item) => { const Icon = item.icon; return <button key={item.id} className={cx(theme === item.id && "active")} onClick={() => setTheme(item.id)}><span><Icon size={20} weight={theme === item.id ? "fill" : "regular"} /></span><small>{item.label}</small></button>; })}</div></GlassSurface>;
}

function SpatialDock({ page, setPage, openUpload }) {
  const items = navItems.filter((item) => ["dashboard","library","ai","goals","review"].includes(item.id));
  return <nav className="spatial-dock glass-surface-static" aria-label="空间导航">
    <button className="dock-brand" onClick={() => setPage("dashboard")} aria-label="返回知序总览"><span>知</span><strong>知序</strong></button>
    <div className="dock-links">{items.map((item) => { const Icon = item.icon; const active = page === item.id; return <motion.button key={item.id} className={cx(active && "active")} onClick={() => setPage(item.id)} whileTap={{ scale:.92 }} transition={{ type:"spring",stiffness:420,damping:30 }}>{active && <motion.i layoutId="spatial-dock-lens" />}<Icon size={18} weight={active ? "fill" : "regular"}/><span>{item.label.replace("目标与项目","目标")}</span></motion.button>; })}</div>
    <button className="dock-capture" onClick={openUpload}><Plus size={17}/><span>捕获</span></button><span className="dock-avatar">W</span>
  </nav>;
}

const readingSteps = ["5 分钟扫读结构与小标题","15 分钟标记论点、案例与反例","5 分钟写下 1 条可执行洞见"];

function Dashboard({ knowledge, setPage, startFocus, openReading }) {
  const activeKnowledge = knowledge.filter((item) => !item.deleted);
  const [hubSearch,setHubSearch] = useState("");
  const spring = { type:"spring",stiffness:360,damping:31 };
  const sideNav = [[House,"Home","dashboard"],[Books,"Knowledge Base","library"],[Sparkle,"AI Assistant","ai"],[FolderSimple,"Projects","goals"],[NotePencil,"Notes","reading"],[BookmarkSimple,"Bookmarks","library"],[ArrowCounterClockwise,"Timeline","review"],[SlidersHorizontal,"Settings","strategy"]];
  const modules = [[Books,"Knowledge Base","library"],[ChatCircle,"AI Assistant","ai"],[FolderSimple,"Projects","goals"],[NotePencil,"Notes","reading"],[UploadSimple,"Upload","upload"],[Clock,"Timeline","review"]];
  const recent = [[FilePdf,"EHEDG Guideline 44_2024.pdf","2h ago"],[FileDoc,"Hygienic Design Handbook.docx","5h ago"],[FileDoc,"Auto SC Layout Revision.pptx","Yesterday"],[FileText,"Welding Training Notes.md","2d ago"]];
  const go = (target) => target === "reading" ? openReading() : target === "upload" ? document.querySelector(".dock-capture")?.click() : setPage(target);
  return <section className="hub-home strict-reference" aria-label="My Knowledge Hub">
    <aside className="hub-sidebar light-glass">
      <button className="hub-brand" onClick={()=>setPage("dashboard")}><img src={`${import.meta.env.BASE_URL}knowledge-hub-mark.png`} alt=""/><strong>My Knowledge Hub</strong></button>
      <nav>{sideNav.map(([Icon,label,target],index)=><motion.button key={label} className={index===0?"active":""} onClick={()=>go(target)} whileTap={{scale:.96}} transition={spring}><Icon size={19}/><span>{label}</span></motion.button>)}</nav>
      <button className="hub-profile" onClick={()=>setPage("strategy")}><span className="avatar">W</span><span><strong>Wesley</strong><small>Keep Growing</small></span><CaretRight size={15}/></button>
    </aside>
    <main className="hub-main">
      <header className="hub-top">
        <form className="hub-search light-glass" onSubmit={(e)=>{e.preventDefault();setPage(hubSearch.trim()?"ai":"library")}}><MagnifyingGlass size={22}/><input value={hubSearch} onChange={(e)=>setHubSearch(e.target.value)} placeholder="Search anything..."/></form>
        <motion.button className="hub-top-icon" onClick={()=>setPage("review")} whileTap={{scale:.92}}><Bell size={20}/><i/></motion.button>
        <motion.button className="hub-top-icon" onClick={()=>setPage("goals")} whileTap={{scale:.92}}><CalendarDots size={20}/></motion.button>
        <button className="hub-time light-glass" onClick={()=>setPage("review")}><strong>{new Intl.DateTimeFormat("en-US",{hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date())}</strong><small>{new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date())}</small></button>
      </header>
      <div className="hub-greeting"><span><Sparkle size={40} weight="thin"/></span><div><h1>Good Morning, Wesley</h1><p>Stay curious. Keep growing.</p></div><blockquote><b>“</b>The best way to predict<br/>the future is to create it.<cite>— Peter Drucker</cite></blockquote></div>
      <motion.button className="focus-glass light-glass" onClick={startFocus} whileHover={{y:-4}} whileTap={{scale:.98}} transition={spring}>
        <span className="hub-card-title">Daily Focus <span>•••</span></span><div className="focus-content"><span className="focus-ring"><b>68%</b><small>Progress</small></span><ul><li>EHEDG Training <CheckCircle size={14} weight="fill"/></li><li>Auto SC Project <CircleNotch size={14}/></li><li>Handbook Update <CircleNotch size={14}/></li><li>Hygienic Welding <CircleNotch size={14}/></li></ul></div>
      </motion.button>
      <div className="quick-glass light-glass"><span className="hub-card-title">Quick Access <button onClick={()=>setPage("library")}><Plus size={15}/></button></span><div>{[[ShieldCheck,"Standards"],[Books,"Trainings"],[FileText,"Templates"],[BookmarkSimple,"References"]].map(([Icon,label],index)=><motion.button key={label} onClick={()=>go(index===1?"reading":"library")} whileHover={{y:-3}} whileTap={{scale:.94}} transition={spring}><Icon size={21}/><small>{label}</small></motion.button>)}</div></div>
      <div className="hub-center">
        <motion.button className="k-core-button" onClick={()=>setPage("ai")} aria-label="Open K knowledge core" whileHover={{scale:1.045}} whileTap={{scale:.96}} transition={spring}>
          <span className="k-core-glow" aria-hidden="true"/>
          <img className="k-crystal-shell" src={`${import.meta.env.BASE_URL}k-crystal-core-v9.png`} alt="" aria-hidden="true"/>
          <strong>K</strong><small>KNOWLEDGE CORE</small>
        </motion.button>
        {modules.map(([Icon,label,target],index)=><motion.button key={label} className={`hub-module module-${index} light-glass`} style={(index===0||index===4)?{x:"-50%"}:undefined} onClick={()=>go(target)} whileHover={{y:-6,scale:1.025}} whileTap={{scale:.95}} transition={spring}><Icon size={index===0?31:28} weight="duotone"/><strong>{label}</strong></motion.button>)}
      </div>
      <motion.button className="stats-glass light-glass" onClick={()=>setPage("library")} whileHover={{y:-3}} whileTap={{scale:.98}} transition={spring}><span className="hub-card-title">Knowledge Stats <span>•••</span></span><div><span><b>326</b><small>Documents</small></span><span><b>48</b><small>Folders</small></span><span><b>12.4 <em>GB</em></b><small>Storage Used</small></span></div><span className="stats-bars">{[24,43,39,58,77,61,82].map((v,i)=><i key={i} style={{height:`${v}%`}}/>)}</span><small className="stats-days">Mon　 Tue　 Wed　 Thu　 Fri　 Sat　 Sun</small></motion.button>
      <div className="activity-glass light-glass"><span className="hub-card-title">Recent Activity <button onClick={()=>setPage("library")}>View all</button></span>{recent.map(([Icon,title,time])=><motion.button key={title} onClick={()=>setPage("library")} whileHover={{x:3}} whileTap={{scale:.98}} transition={spring}><Icon size={18} weight="duotone"/><strong>{title}</strong><small>{time}</small></motion.button>)}</div>
      <form className="hub-ask light-glass" onSubmit={(e)=>{e.preventDefault();setPage("ai")}}><Sparkle size={21} weight="fill"/><input value={hubSearch} onChange={(e)=>setHubSearch(e.target.value)} placeholder="Ask AI anything about your knowledge..."/><button aria-label="Ask AI"><ArrowRight size={19}/></button></form>
      <div className="hub-prompts">{["Summarize a document","Compare standards","Find key insights","Generate report"].map((text)=><button key={text} onClick={()=>{setHubSearch(text);setPage("ai")}}><Sparkle size={10}/>{text}</button>)}</div>
    </main>
  </section>;
}

function ReadingOverlay({ state, setState, onClose, notify }) {
  const [draft,setDraft] = useState(state);
  const update = (changes) => setDraft((current) => ({...current,...changes}));
  const toggleStep = (index) => update({ steps: readingSteps.map((_,i) => i === index ? !draft.steps?.[i] : Boolean(draft.steps?.[i])) });
  const save = (completed = false) => { const next={...draft,completed:completed || draft.completed,updatedAt:new Date().toISOString()};setDraft(next);setState(next);notify(completed ? "精读完成，已沉淀为成长证据" : "读书笔记已保存"); };
  const share = async () => { save(true); const text=`《卓有成效的管理者》第2章\n我的理解：${draft.understanding || "（待补充）"}\n明日应用：${draft.application || "（待补充）"}`; try { if(navigator.share) await navigator.share({title:"我的精读笔记",text}); else { await navigator.clipboard.writeText(text);notify("笔记摘要已复制，可以分享了"); } } catch { /* user cancelled */ } };
  return <motion.div className="modal-backdrop reading-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(event)=>event.target===event.currentTarget&&onClose()}><motion.section layoutId="reading-module" className="reading-sheet glass-surface-static" transition={{type:"spring",stiffness:260,damping:30}}><button className="reading-close" onClick={onClose} aria-label="关闭精读"><X size={20}/></button><span className="eyebrow">TODAY'S DEEP READING · 25 MIN</span><h2>《卓有成效的管理者》</h2><h3>第 2 章：掌握自己的时间</h3><div className="reading-sheet-grid"><div><span className="section-label">精读路径</span><div className="step-checklist">{readingSteps.map((step,index)=><button key={step} className={draft.steps?.[index]?"done":""} onClick={()=>toggleStep(index)}><i>{draft.steps?.[index]?<Check size={15} weight="bold"/>:index+1}</i><span>{step}</span></button>)}</div><blockquote>“时间是最稀缺的资源。若不能管理时间，便不能管理其他任何事情。”</blockquote></div><div className="reading-notes"><label><span>原文句子</span><textarea value={draft.quote||""} onChange={(e)=>update({quote:e.target.value})} placeholder="摘录一句真正击中你的原文…"/></label><label><span>我的理解</span><textarea value={draft.understanding||""} onChange={(e)=>update({understanding:e.target.value})} placeholder="用自己的话解释它，不要复述…"/></label><label><span>明日应用</span><textarea value={draft.application||""} onChange={(e)=>update({application:e.target.value})} placeholder="明天具体在哪个场景做什么？"/></label></div></div><div className="reading-sheet-actions"><button onClick={()=>save(false)}>保存进度</button><MagneticButton className="primary" onClick={()=>save(true)}><CheckCircle size={18}/>完成精读</MagneticButton><MagneticButton className="share-button" onClick={share}><PaperPlaneTilt size={18}/>记录并分享</MagneticButton></div></motion.section></motion.div>;
}

function FileTypeIcon({ item, size = 21 }) { const Icon = fileIcons[item.fileType] ?? File; return <Icon size={size} weight="duotone" />; }
function formatDate(date) { return new Intl.DateTimeFormat("zh-CN",{ month:"2-digit",day:"2-digit" }).format(new Date(date)); }

function LibraryPage({ knowledge, setKnowledge, openUpload, notify }) {
  const [selectedSpace,setSelectedSpace] = useState("全部知识"); const [search,setSearch] = useState(""); const [view,setView] = useState("grid"); const [sort,setSort] = useState("updated"); const [selectedIds,setSelectedIds] = useState([]); const [detailId,setDetailId] = useState(null); const [editingTitle,setEditingTitle] = useState(false);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return knowledge.filter((item) => !item.deleted).filter((item) => selectedSpace === "全部知识" || (selectedSpace === "收件箱" ? item.status !== "ready" : item.space === selectedSpace)).filter((item) => !query || `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase().includes(query)).sort((a,b) => sort === "title" ? a.title.localeCompare(b.title,"zh-CN") : sort === "type" ? a.fileType.localeCompare(b.fileType) : new Date(b.updatedAt) - new Date(a.updatedAt));
  },[knowledge,selectedSpace,search,sort]);
  const detail = knowledge.find((item) => item.id === detailId);
  const mutateSelected = (changes) => { setKnowledge((items) => items.map((item) => selectedIds.includes(item.id) ? { ...item,...changes } : item)); setSelectedIds([]); };
  const updateItem = (id,changes) => setKnowledge((items) => items.map((item) => item.id === id ? { ...item,...changes } : item));
  return <div className="library-layout">
    <GlassSurface className="library-sidebar"><div className="library-side-title"><span>知识空间</span><button aria-label="新建知识空间"><Plus size={17} /></button></div>{spaces.map((space) => { const count = space === "全部知识" ? knowledge.filter((item) => !item.deleted).length : knowledge.filter((item) => !item.deleted && item.space === space).length; return <button key={space} className={cx("space-item",selectedSpace === space && "active")} onClick={() => setSelectedSpace(space)}>{space === "收件箱" ? <TrayArrowDown size={18} /> : <FolderSimple size={18} />}<span>{space}</span><small>{count}</small></button>; })}<div className="storage-note"><ShieldCheck size={18} /><span><strong>浏览器本地保存</strong><small>资料不会自动上传到第三方</small></span></div></GlassSurface>
    <div className="library-main"><GlassSurface className="library-hero"><div><span className="eyebrow">PERSONAL KNOWLEDGE VAULT</span><h2>让每份知识都有去处</h2><p>导入、分类、整理，再让知识连接到目标、行动与成长证据。</p></div><MagneticButton className="primary" onClick={openUpload}><UploadSimple size={19} /><span>分类上传知识</span></MagneticButton></GlassSurface>
      <div className="library-toolbar"><label className="search-field"><MagnifyingGlass size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索标题、摘要或标签…" aria-label="搜索知识" />{search && <button onClick={() => setSearch("")} aria-label="清空搜索"><X size={16} /></button>}</label><label className="toolbar-select"><Funnel size={17} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="知识排序方式"><option value="updated">最近更新</option><option value="title">标题排序</option><option value="type">类型排序</option></select></label><div className="view-switch"><button className={cx(view === "grid" && "active")} onClick={() => setView("grid")} aria-label="网格视图"><SquaresFour size={18} /></button><button className={cx(view === "list" && "active")} onClick={() => setView("list")} aria-label="列表视图"><ListBullets size={18} /></button></div></div>
      <AnimatePresence>{selectedIds.length > 0 && <motion.div className="batch-bar glass-surface-static" initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}><strong>已选择 {selectedIds.length} 项</strong><label><FolderOpen size={17} /><select defaultValue="" onChange={(event) => event.target.value && mutateSelected({ space:event.target.value })}><option value="" disabled>移动到…</option>{spaces.slice(2).map((space) => <option key={space}>{space}</option>)}</select></label><button onClick={() => { mutateSelected({ archived:true }); notify("已归档所选知识"); }}><Archive size={17} />归档</button><button className="danger" onClick={() => { mutateSelected({ deleted:true }); notify("已移入回收站"); }}><Trash size={17} />删除</button><button onClick={() => setSelectedIds([])}><X size={17} /></button></motion.div>}</AnimatePresence>
      <div className={cx("knowledge-collection",view)}><AnimatePresence mode="popLayout">{filtered.map((item) => { const checked = selectedIds.includes(item.id); return <motion.article layout key={item.id} className={cx("knowledge-card glass-surface-static",checked && "selected")} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,scale:.96 }}><button className="select-check" aria-label={checked ? `取消选择${item.title}` : `选择${item.title}`} onClick={() => setSelectedIds((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids,item.id])}>{checked ? <Check size={13} weight="bold" /> : null}</button><button className="knowledge-open" onClick={() => setDetailId(item.id)}><span className="file-icon"><FileTypeIcon item={item} size={25} /></span><span className="file-kicker">{item.space} · {item.fileType.toUpperCase()}</span><strong>{item.title}</strong><p>{item.summary}</p><span className="tag-list">{item.tags.slice(0,3).map((tag) => <em key={tag}>#{tag}</em>)}</span><span className="file-meta"><small>{formatDate(item.updatedAt)}</small><small>{item.size}</small><CaretRight size={16} /></span></button><button className={cx("favorite-button",item.favorite && "active")} aria-label={item.favorite ? `取消收藏${item.title}` : `收藏${item.title}`} onClick={() => updateItem(item.id,{ favorite:!item.favorite })}><Star size={17} weight={item.favorite ? "fill" : "regular"} /></button></motion.article>; })}</AnimatePresence>{filtered.length === 0 && <div className="empty-state glass-surface-static"><MagnifyingGlass size={28} /><strong>没有找到匹配的知识</strong><p>换个关键词，或切换知识空间再试试。</p></div>}</div>
    </div>
    <AnimatePresence>{detail && <motion.aside className="detail-sheet glass-surface-static" initial={{ x:"105%" }} animate={{ x:0 }} exit={{ x:"105%" }} transition={{ type:"spring",stiffness:260,damping:30 }}><div className="sheet-top"><span>知识详情</span><button onClick={() => setDetailId(null)}><X size={20} /></button></div><div className="detail-file-icon"><FileTypeIcon item={detail} size={34} /></div>{editingTitle ? <input className="title-editor" autoFocus defaultValue={detail.title} onBlur={(event) => { updateItem(detail.id,{ title:event.target.value || detail.title }); setEditingTitle(false); }} onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()} /> : <div className="detail-title"><h3>{detail.title}</h3><button onClick={() => setEditingTitle(true)}><PencilSimple size={17} /></button></div>}<p className="detail-summary">{detail.summary}</p><div className="detail-section"><span className="eyebrow">AI 摘要与内容</span><p>{detail.content || "该文件已建立元数据索引。当前纯前端版本暂不解析此二进制格式的正文。"}</p></div><div className="detail-section"><span className="eyebrow">知识空间</span><label className="scope-select"><select value={detail.space} onChange={(event) => updateItem(detail.id,{ space:event.target.value })}>{spaces.slice(2).map((space) => <option key={space}>{space}</option>)}</select><CaretDown size={16} /></label></div><div className="detail-section"><span className="eyebrow">标签</span><div className="tag-list large">{detail.tags.map((tag) => <em key={tag}>#{tag}</em>)}<button><Plus size={14} />添加</button></div></div><div className="detail-actions"><button onClick={() => { updateItem(detail.id,{ archived:true }); notify("知识已归档"); }}><Archive size={18} />归档</button><button className="danger" onClick={() => { updateItem(detail.id,{ deleted:true }); setDetailId(null); notify("已移入回收站"); }}><Trash size={18} />删除</button></div></motion.aside>}</AnimatePresence>
  </div>;
}

function AIPage({ knowledge, actions, setActions, notify }) {
  const [scope,setScope] = useState("全部知识"); const [query,setQuery] = useState("基于我的知识，帮我决定今天最值得推进的一件事"); const [answer,setAnswer] = useState(() => makeAnswer(query,knowledge,scope)); const [loading,setLoading] = useState(false);
  const runQuery = (nextQuery = query) => { if (!nextQuery.trim()) return; setLoading(true); window.setTimeout(() => { setAnswer(makeAnswer(nextQuery,knowledge,scope)); setLoading(false); },650); };
  const submit = (event) => { event?.preventDefault(); runQuery(); };
  const convert = () => { if (actions.some((item) => item.title === answer.title)) return notify("这条行动已经在今日清单中"); setActions((items) => [{ id:`ai-${Date.now()}`,title:answer.title,detail:answer.body.slice(0,90),domain:scope,duration:"60 分钟",evidence:"完成记录",completed:false },...items]); notify("已转为今日行动"); };
  return <div className="ai-workspace">
    <GlassSurface className="ai-scope-rail"><span className="eyebrow">知识范围</span>{spaces.filter((space) => space !== "收件箱").map((space) => <button className={cx(scope === space && "active")} key={space} onClick={() => setScope(space)}><FolderSimple size={18} weight={scope === space ? "fill" : "regular"} /><span>{space}</span></button>)}<div className="local-badge"><ShieldCheck size={18} /><span><strong>本地知识检索</strong><small>不发送文件与密钥</small></span></div></GlassSurface>
    <GlassSurface className="ai-canvas"><form className="ai-question" onSubmit={submit}><span><Brain size={24} weight="duotone" /></span><textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={2} aria-label="向本地知识库提问" /><button type="submit" disabled={loading} aria-label="发送问题">{loading ? <CircleNotch className="spin" size={20} /> : <PaperPlaneTilt size={20} weight="fill" />}</button></form><div className="prompt-chips">{["总结我本周最重要的学习","把资料转为检查清单","对比三份笔记的共同观点"].map((prompt) => <button key={prompt} onClick={() => { setQuery(prompt); runQuery(prompt); }}>{prompt}</button>)}</div><AnimatePresence mode="wait">{loading ? <motion.div className="ai-loading" key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><span /><span /><span /><p>正在检索、排序并生成带引用的回答…</p></motion.div> : <motion.div className="full-answer" key={`${answer.title}-${scope}`} initial={{ opacity:0,y:14,filter:"blur(8px)" }} animate={{ opacity:1,y:0,filter:"blur(0px)" }} exit={{ opacity:0,y:-8 }}><AnswerContent answer={answer} onConvert={convert} onSave={() => notify("已保存为成长证据")} /></motion.div>}</AnimatePresence></GlassSurface>
    <GlassSurface className="transform-rail"><span className="eyebrow">成长转化</span>{[[Lightning,"保存为行动","生成可执行步骤与时间安排",convert],[NotePencil,"形成笔记","记录思路、依据与关键决策",() => notify("已形成一条结构化笔记")],[Star,"产出作品证据","沉淀为可复用、可展示成果",() => notify("已保存为成长证据")],[ArrowCounterClockwise,"纳入复盘","跟踪结果与下一步",() => notify("已加入本周复盘")]].map(([Icon,label,note,handler]) => <button key={label} onClick={handler}><span><Icon size={21} weight="duotone" /></span><span><strong>{label}</strong><small>{note}</small></span><Plus size={17} /></button>)}</GlassSurface>
  </div>;
}

function GoalsPage({ actions, setActions, notify }) {
  const completed = actions.filter((item) => item.completed).length;
  return <div className="goals-grid"><GlassSurface className="goal-summary"><div><span className="eyebrow">2026 GROWTH ARC</span><h2>让目标成为成长的方向，而不是压力的来源。</h2><p>今年专注于五条互相增强的成长主线，每条都要留下可验证的作品或行为证据。</p></div><div className="goal-ring"><strong>{Math.round(growthDomains.reduce((total,domain) => total + domain.progress,0) / growthDomains.length)}%</strong><span>年度综合进度</span></div></GlassSurface><GlassSurface className="domain-progress-list"><div className="section-head"><span><Target size={20} />成长主线</span><button><SlidersHorizontal size={17} />调整权重</button></div>{growthDomains.map((domain) => { const Icon = iconByDomain[domain.icon]; return <div className="domain-progress-row" key={domain.id}><span className={`tone-${domain.color}`}><Icon size={21} weight="duotone" /></span><div><strong>{domain.label}</strong><small>{domain.note}</small><span className="progress-track"><i style={{ width:`${domain.progress}%` }} /></span></div><em>{domain.progress}%</em></div>; })}</GlassSurface><GlassSurface className="action-list-panel"><div className="section-head"><span><Lightning size={20} />今日行动</span><small>{completed}/{actions.length} 完成</small></div><div className="action-list">{actions.map((action) => <motion.button layout key={action.id} className={cx("action-row",action.completed && "completed")} onClick={() => { setActions((items) => items.map((item) => item.id === action.id ? { ...item,completed:!item.completed } : item)); notify(action.completed ? "已恢复行动" : "已记录完成"); }}><span className="action-check">{action.completed && <Check size={15} weight="bold" />}</span><span><strong>{action.title}</strong><small>{action.detail}</small><em>{action.domain} · {action.duration}</em></span><CaretRight size={17} /></motion.button>)}</div></GlassSurface></div>;
}

function StrategyPage() {
  const years = [["2026","系统成形","完成知识检索作品，形成稳定的英语、阅读、运动与复盘节奏。"],["2027","能力复利","专业方法与 AI 能力开始互相增强，持续输出可复用作品。"],["2028","影响扩大","通过项目、写作和分享，让经验帮助更多真实问题。"],["2029","选择增加","拥有更强的专业选择权、创造力与生活稳定性。"],["2030","自由创造","把长期积累转化为作品、收入、健康与更大的自主性。"]];
  return <div className="strategy-layout"><GlassSurface className="vision-hero"><span className="eyebrow">FIVE-YEAR ARC</span><h2>成为一个能持续学习、清晰表达、可靠交付，也能照顾好生活的人。</h2><p>不把成长压缩成单一职业目标。专业深度、技术能力、表达输出、身体状态和选择权共同构成长期复利。</p></GlassSurface><GlassSurface className="year-roadmap">{years.map(([year,title,note],index) => <div className={cx("year-step",index === 0 && "active")} key={year}><span>{year}</span><div><strong>{title}</strong><p>{note}</p></div><em>{String(index + 1).padStart(2,"0")}</em></div>)}</GlassSurface><GlassSurface className="strategy-principles"><span className="eyebrow">成长原则</span>{["知识必须通向真实问题","用作品证明能力，而不是用收藏安慰自己","让最重要的一件事先得到完整时间","每周修正方向，每季度留下证据"].map((item,index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</GlassSurface></div>;
}

function ReviewPage({ actions, knowledge }) {
  const completed = actions.filter((item) => item.completed).length;
  return <div className="review-layout"><GlassSurface className="review-hero"><div><span className="eyebrow">WEEK 34 · 08.17—08.23</span><h2>这一周，你正在把“知道”变成“做到”。</h2><p>重点不是完成了多少，而是哪些行动真正推动了能力、作品与生活。</p></div><span className="review-score"><strong>72</strong><small>成长节奏</small></span></GlassSurface><div className="review-metrics">{[[CheckCircle,"完成行动",`${completed} 项`,"比上周 +1"],[Books,"新增知识",`${knowledge.length} 条`,"3 条已应用"],[Timer,"深度时间","6.5 小时","专注质量稳定"],[Star,"成长证据","4 条","2 条可复用"]].map(([Icon,label,value,note]) => <GlassSurface className="review-metric" key={label}><Icon size={23} weight="duotone" /><span>{label}</span><strong>{value}</strong><small>{note}</small></GlassSurface>)}</div><GlassSurface className="review-columns"><div><span className="eyebrow">这一周做对了什么</span>{["把 AI 学习收敛成可交付的检索模块","英语训练开始使用固定表达结构","运动节奏稳定，没有用强度换焦虑"].map((item) => <p key={item}><CheckCircle size={18} weight="fill" />{item}</p>)}</div><div><span className="eyebrow">下一周只推进什么</span><h3>完成检索模块闭环并写一篇实现复盘。</h3><p>范围只包含召回、引用回链、测试与设计取舍，不继续增加新功能。</p><button><CalendarDots size={18} />安排到下周</button></div></GlassSurface></div>;
}

function UploadSheet({ onClose, onImport, notify }) {
  const inputRef = useRef(null); const [files,setFiles] = useState([]); const [space,setSpace] = useState("AI 与自动化"); const [stage,setStage] = useState("select"); const [dragging,setDragging] = useState(false);
  const addFiles = (list) => { const next = Array.from(list).map((file) => ({ file,id:`${file.name}-${file.lastModified}`,status:"waiting" })); setFiles((current) => [...current,...next.filter((item) => !current.some((existing) => existing.id === item.id))]); };
  const processFiles = async () => {
    if (!files.length) return; setStage("processing"); const items = [];
    for (const [index,entry] of files.entries()) {
      setFiles((current) => current.map((item) => item.id === entry.id ? { ...item,status:"processing" } : item));
      const extension = entry.file.name.split(".").pop()?.toLowerCase() || "file"; const readable = ["txt","md","json","csv"].includes(extension); let content = "";
      if (readable) { try { content = await entry.file.text(); } catch { content = ""; } }
      await new Promise((resolve) => window.setTimeout(resolve,320 + index * 90));
      items.push({ id:`upload-${Date.now()}-${index}`,title:entry.file.name.replace(/\.[^.]+$/,"") ,type:readable ? "可检索文档" : "已索引文件",fileType:extension,space,size:entry.file.size > 1024*1024 ? `${(entry.file.size/1024/1024).toFixed(1)} MB` : `${Math.max(1,Math.round(entry.file.size/1024))} KB`,updatedAt:new Date().toISOString(),status:"ready",tags:readable ? ["已解析","可问答"] : ["元数据索引","待深度解析"],summary:readable ? "已读取文本内容，可用于本地检索、引用与回答。" : "已完成分类与元数据索引。纯前端版本暂不解析该二进制格式正文。",content:content.slice(0,18000),source:readable ? "上传文档 · 文本内容" : "上传文件 · 元数据",favorite:false });
      setFiles((current) => current.map((item) => item.id === entry.id ? { ...item,status:"done" } : item));
    }
    onImport(items); setStage("done"); notify(`已导入 ${items.length} 份知识`);
  };
  return <motion.div className="modal-backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section className="upload-sheet glass-surface-static" initial={{ y:36,opacity:0,scale:.97 }} animate={{ y:0,opacity:1,scale:1 }} exit={{ y:24,opacity:0,scale:.98 }} transition={{ type:"spring",stiffness:280,damping:28 }}><div className="sheet-top"><div><span className="eyebrow">KNOWLEDGE INTAKE</span><h2>分类上传知识</h2><p>先选择知识空间，再让资料进入整理与检索流程。</p></div><button onClick={onClose}><X size={21} /></button></div>{stage !== "done" ? <><div className="upload-grid"><button className={cx("drop-zone",dragging && "dragging")} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault();setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault();setDragging(false);addFiles(event.dataTransfer.files); }}><span className="upload-orb"><UploadSimple size={29} weight="duotone" /></span><strong>拖拽文件到这里</strong><p>或点击选择 PDF、Office、Markdown、文本、图片、音视频</p><small>文本与 Markdown 可直接参与本地问答</small></button><div className="upload-settings"><label><span>知识空间</span><select value={space} onChange={(event) => setSpace(event.target.value)}>{spaces.slice(2).map((item) => <option key={item}>{item}</option>)}</select></label><div className="privacy-box"><ShieldCheck size={21} weight="duotone" /><span><strong>本地优先</strong><small>文件不会在这个演示版本中自动发送到任何模型或第三方服务。</small></span></div></div></div><input ref={inputRef} type="file" multiple hidden onChange={(event) => addFiles(event.target.files)} /><div className="upload-file-list">{files.map((entry) => <div key={entry.id}><span className="file-icon"><File size={19} /></span><span><strong>{entry.file.name}</strong><small>{Math.max(1,Math.round(entry.file.size/1024))} KB</small></span><em className={entry.status}>{entry.status === "waiting" ? "待处理" : entry.status === "processing" ? "正在解析" : "已完成"}</em>{entry.status === "waiting" && <button onClick={() => setFiles((items) => items.filter((item) => item.id !== entry.id))}><X size={16} /></button>}</div>)}{!files.length && <p className="file-list-empty">还没有选择文件</p>}</div><div className="upload-actions"><button className="text-button" onClick={onClose}>取消</button><MagneticButton className="primary" onClick={processFiles} disabled={!files.length || stage === "processing"}>{stage === "processing" ? <><CircleNotch className="spin" size={18} />正在建立索引</> : <><span>开始导入</span><ArrowRight size={18} /></>}</MagneticButton></div></> : <div className="upload-success"><span><Check size={34} weight="bold" /></span><h3>知识已进入你的成长系统</h3><p>已完成分类、摘要与本地索引。现在可以在知识库中整理，或直接向它提问。</p><div><button onClick={onClose}>继续上传</button><MagneticButton className="primary" onClick={onClose}>查看知识库<ArrowRight size={18} /></MagneticButton></div></div>}</motion.section></motion.div>;
}

function FocusOverlay({ onClose, actions, setActions, notify }) {
  const focus = actions[0] ?? seedActions[0]; const [minutes,setMinutes] = useState(90);
  return <motion.div className="modal-backdrop focus-backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}><motion.section className="focus-overlay glass-surface-static" initial={{ scale:.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:.94,opacity:0 }}><button className="focus-close" onClick={onClose}><X size={20} /></button><span className="focus-spark"><Lightning size={28} weight="fill" /></span><span className="eyebrow">今日最重要的一件事</span><h2>{focus.title}</h2><p>{focus.detail}</p><div className="focus-timer"><Timer size={24} /><strong>{minutes}:00</strong><span>深度推进</span></div><div className="focus-presets">{[25,50,90].map((value) => <button className={cx(minutes === value && "active")} key={value} onClick={() => setMinutes(value)}>{value} 分钟</button>)}</div><MagneticButton className="primary focus-complete" onClick={() => { setActions((items) => items.map((item,index) => index === 0 ? { ...item,completed:true } : item));notify("已记录一条成长证据");onClose(); }}><CheckCircle size={20} />完成并留下证据</MagneticButton></motion.section></motion.div>;
}

function Toast({ message }) { return <motion.div className="toast glass-surface-static" initial={{ opacity:0,y:16,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:10,scale:.98 }}><CheckCircle size={19} weight="fill" />{message}</motion.div>; }

export function App() {
  const reduced = useReducedMotion(); const [page,setPage] = usePersistentState("zhixu-page","dashboard"); const [theme,setTheme] = usePersistentState("zhixu-theme","aurora"); const [knowledge,setKnowledge] = usePersistentState("zhixu-knowledge-v2",seedKnowledge); const [actions,setActions] = usePersistentState("zhixu-actions-v2",seedActions); const [readingState,setReadingState] = usePersistentState("zhixu-reading-v3",{steps:[false,false,false],quote:"",understanding:"",application:"",completed:false}); const [uploadOpen,setUploadOpen] = useState(false); const [focusOpen,setFocusOpen] = useState(false); const [readingOpen,setReadingOpen] = useState(false); const [toast,setToast] = useState(""); const [pointer,setPointer] = useState({ x:0,y:0 });
  const notify = (message) => { setToast(message); window.clearTimeout(window.__zhixuToast); window.__zhixuToast = window.setTimeout(() => setToast(""),2600); };
  useEffect(() => { const onMove = (event) => { if (reduced) return; setPointer({ x:(event.clientX/window.innerWidth-.5)*-12,y:(event.clientY/window.innerHeight-.5)*-8 }); }; window.addEventListener("pointermove",onMove,{ passive:true }); return () => window.removeEventListener("pointermove",onMove); },[reduced]);
  const convertAnswer = () => { if (!actions.some((item) => item.title.includes("检索模块"))) setActions((items) => [seedActions[0],...items]); notify("已转为今日行动"); };
  return <div className={cx("app-shell",`theme-${theme}`,page === "dashboard" && "is-command-home")}><motion.img className="ambient-background" src={`${import.meta.env.BASE_URL}${page === "dashboard" ? "ocean-cosmos-command-bg.png" : "aurora-knowledge-field.png"}`} alt="" aria-hidden="true" animate={{ x:pointer.x,y:pointer.y,scale:1.035 }} transition={{ type:"spring",stiffness:35,damping:30 }} /><div className="ambient-scrim" /><SpatialDock page={page} setPage={setPage} openUpload={() => setUploadOpen(true)}/>{page !== "dashboard" && <Sidebar page={page} setPage={setPage} theme={theme} setTheme={setTheme} />}<main className="app-main">{page !== "dashboard" && <TopBar page={page} setPage={setPage} openUpload={() => setUploadOpen(true)} startFocus={() => setFocusOpen(true)} />}<AnimatePresence mode="wait"><motion.div className="page-stage" key={page} initial={{ opacity:0,y:16,filter:"blur(10px)" }} animate={{ opacity:1,y:0,filter:"blur(0px)" }} exit={{ opacity:0,y:-10,filter:"blur(8px)" }} transition={{ duration:reduced ? 0 : .38,ease:[.22,1,.36,1] }}>{page === "dashboard" && <Dashboard knowledge={knowledge} setPage={setPage} startFocus={() => setFocusOpen(true)} openReading={() => setReadingOpen(true)} readingState={readingState}/>} {page === "library" && <LibraryPage knowledge={knowledge} setKnowledge={setKnowledge} openUpload={() => setUploadOpen(true)} notify={notify} />}{page === "ai" && <AIPage knowledge={knowledge} actions={actions} setActions={setActions} notify={notify} />}{page === "goals" && <GoalsPage actions={actions} setActions={setActions} notify={notify} />}{page === "strategy" && <StrategyPage />}{page === "review" && <ReviewPage actions={actions} knowledge={knowledge} />}</motion.div></AnimatePresence></main><MobileNav page={page} setPage={setPage} /><AnimatePresence>{uploadOpen && <UploadSheet onClose={() => setUploadOpen(false)} onImport={(items) => { setKnowledge((current) => [...items,...current]);setPage("library"); }} notify={notify} />}</AnimatePresence><AnimatePresence>{focusOpen && <FocusOverlay onClose={() => setFocusOpen(false)} actions={actions} setActions={setActions} notify={notify} />}</AnimatePresence><AnimatePresence>{readingOpen && <ReadingOverlay state={readingState} setState={setReadingState} onClose={() => setReadingOpen(false)} notify={notify}/>}</AnimatePresence><AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence></div>;
}
