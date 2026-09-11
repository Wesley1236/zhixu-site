import {Localize} from './Locale';
import { useEffect, useRef, useState } from "react";
import { ArrowSquareOut, CheckCircle, Copy, DownloadSimple, Microphone, Pause, Play, ArrowCounterClockwise } from "@phosphor-icons/react";
import { STORAGE_KEY, TRACKS, coachPrompt, dateKey, dayNumber, emptyTraining, isComplete, lessonFor, notesMarkdown, parseTraining } from "./expression-plan.js";

const stages = [["01", "理清思路", "1 分钟", "只写 3 个关键词，不写逐字稿。"], ["02", "第一轮开口", "2 分钟", "先完整表达，再让教练纠错。"], ["03", "对话与纠错", "3 分钟", "接受追问，聚焦 3 个关键问题。"], ["04", "重新表达", "2 分钟", "用改进后的结构再说一次。"], ["05", "留下成长证据", "2 分钟", "回填原话、纠错和下次重点。"]];

function PracticeTimer() {
  const [remaining, setRemaining] = useState(600);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    const tick = () => {const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));setRemaining(next);if (!next) setRunning(false);};
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [running]);
  const toggle = () => {
    if (running) {setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));setRunning(false);} else
    {const next = remaining || 600;deadline.current = Date.now() + next * 1000;setRemaining(next);setRunning(true);}
  };
  return <Localize><div className="practice-timer"><span><small>练习倒计时 · 非录音</small><strong role="timer">{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</strong></span><button onClick={toggle} aria-label={running ? "暂停计时" : "开始计时"}>{running ? <Pause size={20} /> : <Play size={20} />}</button><button onClick={() => {setRunning(false);setRemaining(600);}} aria-label="重置计时"><ArrowCounterClockwise size={19} /></button><span className="timer-status" role="status">{remaining === 0 ? "时间到，可以回填复盘了。" : ""}</span></div></Localize>;
}

export function ExpressionTraining() {
  const [loaded] = useState(() => {
    try {return { value: parseTraining(localStorage.getItem(STORAGE_KEY)), error: "" };}
    catch {return { value: emptyTraining(), error: "无法读取原有训练记录。为保护原记录，本次不会覆盖保存；仍可练习并导出本次笔记。" };}
  });
  const [state, setState] = useState(loaded.value);
  const [storageError, setStorageError] = useState(loaded.error);
  const [saved, setSaved] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [today, setToday] = useState(dateKey());
  const [message, setMessage] = useState("");
  const promptRef = useRef(null);
  const language = state.language;
  const track = state.tracks[language];
  const todayDay = dayNumber(track.start || today, today);
  const day = selectedDay ?? todayDay;
  const lesson = lessonFor(language, day);
  const record = track.records[day] ?? {};
  const prompt = coachPrompt(language, track.level, lesson);
  const doneCount = Object.values(track.records).filter((item) => item.completedAt).length;

  useEffect(() => {
    const refreshDate = () => setToday(dateKey());
    const interval = window.setInterval(refreshDate, 60000);
    window.addEventListener("focus", refreshDate);
    return () => {window.clearInterval(interval);window.removeEventListener("focus", refreshDate);};
  }, []);
  useEffect(() => {
    if (loaded.error) return;
    try {localStorage.setItem(STORAGE_KEY, JSON.stringify(state));setStorageError("");setSaved(true);}
    catch {setStorageError("本地保存失败，可能存储空间不足或浏览器禁用了存储。请先导出笔记，离开页面会丢失未保存内容。");setSaved(false);}
  }, [state, loaded.error]);

  function updateTrack(changes) {
    setSaved(false);
    setState((current) => ({ ...current, tracks: { ...current.tracks, [language]: { ...current.tracks[language], ...changes } } }));
  }
  function updateRecord(changes) {
    setSaved(false);
    setState((current) => {
      const currentTrack = current.tracks[language];
      const next = { ...currentTrack.records[day], ...changes, updatedAt: new Date().toISOString() };
      if (!isComplete(next)) delete next.completedAt;
      return { ...current, tracks: { ...current.tracks, [language]: { ...currentTrack, records: { ...currentTrack.records, [day]: next } } } };
    });
  }
  function chooseDay(value) {setSelectedDay(value);setMessage("");}
  async function copyPrompt() {
    try {await navigator.clipboard.writeText(prompt);setMessage("已复制教练提示词。请在 ChatGPT 的语音会话中提供给教练。");}
    catch {if (promptRef.current) {promptRef.current.closest("details").open = true;promptRef.current.focus();promptRef.current.select();}setMessage("浏览器未允许复制，已选中提示词，请按 Ctrl/Cmd+C 手动复制。");}
  }
  function finish() {
    if (!isComplete(record)) {setMessage("请先填写原表达、教练纠错和重练收获，完成一次真实的复盘。");return;}
    updateRecord({ completedAt: record.completedAt || new Date().toISOString() });
    setMessage("已标记本次训练完成；保存状态见下方。明天继续开口。");
  }
  function exportNotes() {
    const url = URL.createObjectURL(new Blob([notesMarkdown(state, today)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");link.href = url;link.download = `表达训练-${today}.md`;document.body.append(link);link.click();link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("已生成中英文训练笔记下载。");
  }

  return <Localize><section className="expression-training" aria-label="中英文表达训练">
    <header className="expression-hero expression-glass"><div><span className="expression-eyebrow"><Microphone size={17} /> YOUR DAILY VOICE STUDIO</span><h2>把想法，说得更动人。</h2><p>中文练逻辑，英文练自然。每天一段对话，一次纠错，一次更好的重述。</p></div><PracticeTimer key={`${language}-${day}`} /></header>
    <div className="expression-controls"><div className="language-switch" aria-label="选择训练语言">{Object.entries(TRACKS).map(([key, info]) => <button key={key} aria-pressed={language === key} onClick={() => {setState((current) => ({ ...current, language: key, tracks: { ...current.tracks, [key]: { ...current.tracks[key], start: current.tracks[key].start || dateKey() } } }));setSelectedDay(null);setMessage("");}}><span>{key === "zh" ? "中" : "EN"}</span>{info.title}</button>)}</div><label>我的阶段<select value={track.level} onChange={(event) => updateTrack({ level: event.target.value })}>{TRACKS[language].levels.map((level) => <option key={level}>{level}</option>)}</select></label><button className="expression-quiet" onClick={exportNotes}><DownloadSimple size={18} />导出笔记</button></div>
    {storageError && <p className="expression-warning" role="alert">{storageError}</p>}
    <p className="expression-notice" role="status">{message}</p>
    <div className="expression-grid">
      <div className="expression-primary">
        <section className="expression-glass daily-lesson"><div className="lesson-topline"><span>DAY {String(day).padStart(2, "0")} / 28 · 第 {lesson.week} 周</span><span className="lesson-state">{record.completedAt ? <><CheckCircle size={17} />已完成</> : day === todayDay ? "今日练习" : "可提前练习 / 回顾"}</span></div><h3>{lesson.title}</h3><p className="lesson-task">{lesson.task}</p><div className="lesson-focus"><span>本周重点<strong>{lesson.focus}</strong></span><span>第一轮表达<strong>{lesson.seconds} 秒</strong></span></div><div className="lesson-outline"><span>照着这个结构说</span><strong>{lesson.outline}</strong></div><blockquote><small>卡住时，用这句话起步</small>{lesson.opening}</blockquote><div className="practice-stages">{stages.map(([number, title, time, detail]) => <div key={number}><i>{number}</i><span><strong>{title}<small>{number === "02" ? `${lesson.seconds / 60} 分钟` : number === "03" ? `${5 - lesson.seconds / 60} 分钟` : time}</small></strong><p>{detail}</p></span></div>)}</div></section>
        <section className="expression-glass voice-bridge"><span className="expression-eyebrow">VOICE COACH · 外部语音练习</span><h3>让 ChatGPT 陪你开口</h3><p>这里负责计划和复盘；真实语音对话在 ChatGPT 中进行，不会自动开启麦克风或同步对话。</p><ol><li>复制下方为今天定制的教练提示词。</li><li>打开 ChatGPT，在支持语音的客户端中新建语音会话，并向教练提供或朗读提示词。桌面端应先开启新语音会话；入口和可用额度以你的账号为准。</li><li>完成纠错和重述后，回到这里手动记录收获。</li></ol><div className="expression-actions"><button className="expression-primary-button" onClick={copyPrompt}><Copy size={18} />复制今日教练提示词</button><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">打开 ChatGPT<ArrowSquareOut size={18} /></a></div><details><summary>查看 / 手动复制完整提示词</summary><textarea ref={promptRef} value={prompt} readOnly aria-label="今日语音教练提示词" /></details><a className="voice-doc-link" href="https://learn.chatgpt.com/docs/features/voice" target="_blank" rel="noopener noreferrer">官方语音使用说明 ↗</a></section>
        <section className="expression-glass practice-journal"><span className="expression-eyebrow">REFLECT & REPEAT</span><h3>说第二遍，才真正变成你的。</h3><p>三个字段填写完整后才能完成。纠错请来自真实对话，不必追求完美。</p>{[["original", "我的原表达 / 关键句", "记下第一轮中最想改进的一句话。"], ["correction", "GPT 的纠错与更好说法", "原话 → 改进说法 → 为什么这样更好。"], ["takeaway", "重练后的变化 / 明日重点", "第二遍哪里更清楚？明天只改进哪一点？"]].map(([field, label, placeholder]) => <label key={field}>{label}<textarea value={record[field] || ""} onChange={(event) => updateRecord({ [field]: event.target.value })} placeholder={placeholder} maxLength={10000} /></label>)}<div className="expression-actions"><button className="expression-primary-button" onClick={finish}><CheckCircle size={19} />{record.completedAt ? "更新完成记录" : "完成训练并记录"}</button><span className="journal-save" role="status">{storageError ? "尚未保存 · 请导出备份" : saved ? "已保存在此浏览器" : "正在保存…"}</span></div><p className="expression-feedback">{message}</p></section>
      </div>
      <aside className="expression-secondary"><section className="expression-glass course-progress"><span className="expression-eyebrow">YOUR 28-DAY JOURNEY</span><h3>{TRACKS[language].title}计划</h3><p>{TRACKS[language].subtitle}</p><div className="course-count"><strong>{doneCount}<small>/ 28</small></strong><span>已完成训练<br />中英文进度分别保存</span></div><progress max={28} value={doneCount} aria-label={`${TRACKS[language].title}完成进度`} /><button className="expression-quiet" onClick={() => chooseDay(null)}>回到今日 · Day {todayDay}</button><p className="course-start">计划始于 {track.start} · 第 28 天后可持续回顾重练，不自动覆盖笔记。</p>{TRACKS[language].weeks.map((title, index) => <div className="course-week" key={title}><h4>W{index + 1} · {title}</h4><div>{Array.from({ length: 7 }, (_, offset) => index * 7 + offset + 1).map((number) => <button key={number} className={`${number === day ? "selected" : ""} ${track.records[number]?.completedAt ? "completed" : ""}`} aria-pressed={number === day} aria-label={`第 ${number} 天：${lessonFor(language, number).title}${track.records[number]?.completedAt ? "，已完成" : ""}`} title={lessonFor(language, number).title} onClick={() => chooseDay(number)}>{number}{track.records[number]?.completedAt && <CheckCircle size={10} />}</button>)}</div></div>)}</section><section className="expression-glass expression-reminder"><Microphone size={28} /><h3>一次只改一点。</h3><p>{language === "zh" ? "先说结论，再用具体例子支撑。少一点铺垫，多一点真实。" : "You don't need perfect English. You need one clear idea, one real example, and another try."}</p><hr /><small>隐私与边界：本站不录音、不调用语音 API、不保存密钥。只有你主动提供的内容会进入 ChatGPT；训练笔记仅存在当前浏览器，清理浏览器数据会删除笔记，请定期导出。</small></section></aside>
    </div>
  </section></Localize>;
}
