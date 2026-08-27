import test from "node:test";
import assert from "node:assert/strict";
import { TRACKS, coachPrompt, dateKey, dayNumber, emptyTraining, isComplete, lessonFor, notesMarkdown, parseTraining } from "../src/expression-plan.js";

test("both language tracks contain 28 distinct concrete lessons",()=>{
  for (const language of ["zh","en"]) {
    const lessons = Array.from({length:28},(_,i)=>lessonFor(language,i+1));
    assert.equal(new Set(lessons.map(item=>item.title)).size,28);
    for (const item of lessons) {
      assert.ok(item.task && item.outline && item.opening && item.focus);
      assert.equal(item.week,Math.ceil(item.day/7));
      assert.ok(item.seconds>=60 && item.seconds<=180);
    }
  }
});
test("calendar scheduling handles month/year boundaries and caps day range",()=>{
  assert.equal(dateKey(new Date(2026,7,27,23,59)),"2026-08-27");
  assert.equal(dayNumber("2026-08-27","2026-08-27"),1);
  assert.equal(dayNumber("2026-12-31","2027-01-01"),2);
  assert.equal(dayNumber("2024-02-28","2024-03-01"),3);
  assert.equal(dayNumber("2026-08-27","2026-08-20"),1);
  assert.equal(dayNumber("2026-08-27","2027-08-27"),28);
  assert.equal(dayNumber("broken","2026-08-27"),1);
});
test("coaching prompts are language/level specific and do not invent pronunciation feedback",()=>{
  for (const language of ["zh","en"]) {
    const lesson=lessonFor(language,16);
    const level=TRACKS[language].levels.at(-1);
    const prompt=coachPrompt(language,level,lesson);
    assert.ok(prompt.includes(level));assert.ok(prompt.includes(lesson.task));
    assert.ok(prompt.includes("不要推断或评价发音"));assert.ok(prompt.includes("一次只问一个问题"));
    assert.ok(prompt.includes("重新说一遍"));
  }
  assert.notEqual(coachPrompt("zh","基础",lessonFor("zh",1)),coachPrompt("en","A2",lessonFor("en",1)));
});
test("completing practice requires three non-empty real notes",()=>{
  assert.equal(isComplete({}),false);
  assert.equal(isComplete({original:"原话",correction:" ",takeaway:"重说"}),false);
  assert.equal(isComplete({original:"原话",correction:"纠错",takeaway:"重说"}),true);
});
test("storage roundtrip keeps language progress separate and rejects malformed records",()=>{
  const state=emptyTraining("2026-08-27");
  assert.equal(state.tracks.zh.start,"2026-08-27");
  assert.equal(state.tracks.en.start,null,"English plan starts only when selected");
  state.tracks.zh.records[1]={original:"原话",correction:"纠错",takeaway:"重说",completedAt:"2026-08-27T00:00:00Z"};
  const restored=parseTraining(JSON.stringify(state));
  assert.deepEqual(restored,state);assert.deepEqual(restored.tracks.en.records,{});
  assert.throws(()=>parseTraining("{"));assert.throws(()=>parseTraining("null"));
  assert.throws(()=>parseTraining(JSON.stringify({...state,language:"xx"})));
  state.tracks.zh.records[1].original={bad:true};
  assert.throws(()=>parseTraining(JSON.stringify(state)));
});
test("lesson selection clamps invalid numbers",()=>{
  assert.equal(lessonFor("zh",0).day,1);assert.equal(lessonFor("en",99).day,28);assert.equal(lessonFor("zh","no").day,1);
});
test("Markdown export includes both tracks, drafts and completed notes without inventing audio",()=>{
  const state=emptyTraining("2026-08-27");
  state.tracks.zh.records[2]={original:"第二天原话",correction:"纠错",takeaway:"收获",completedAt:"2026-08-28T00:00:00Z"};
  state.tracks.zh.records[1]={original:"第一天草稿"};
  state.tracks.en.records[1]={original:"I am learning to speak clearly."};
  const text=notesMarkdown(state,"2026-08-28");
  assert.ok(text.includes("## 中文表达") && text.includes("## English speaking"));
  assert.ok(text.includes("状态：草稿") && text.includes("状态：已完成"));
  assert.ok(text.includes("第一天草稿") && text.includes("I am learning to speak clearly."));
  assert.ok(text.indexOf("### Day 1") < text.indexOf("### Day 2"));
  assert.ok(text.includes("不包含语音录音"));
});
