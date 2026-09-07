import test from 'node:test';
import assert from 'node:assert/strict';
import {readings,talks,words,bookReferences,dailyReading,dailyTalk,localDay,dueDate} from '../src/learning-content.js';
test('learning library contains complete, unique activities',()=>{
 assert.equal(readings.length,6);assert.equal(talks.length,3);assert.equal(words.length,30);
 for(const collection of [[...readings,...talks],words]){const ids=collection.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);}
 for(const item of readings){assert.ok(item.paragraphs.length>=4);assert.ok(item.questions.length);assert.ok(item.action);}
 for(const item of words){assert.ok(item.meaning);assert.ok(item.example);}
 for(const book of bookReferences){assert.ok(readings.some(r=>r.id===book.reading));assert.match(book.url,/^https:/);}
});
test('calendar rotation and review use local dates across year boundary',()=>{
 const date=new Date(2026,11,31,23,59);
 assert.equal(localDay(date),'2026-12-31');assert.equal(dueDate(1,date),'2027-01-01');assert.equal(dueDate(3,date),'2027-01-03');
 assert.equal(dailyReading(date).id,dailyReading(new Date(2026,11,31,0,1)).id);
 assert.notEqual(dailyReading(date).id,dailyReading(new Date(2027,0,1)).id);
 assert.equal(dailyTalk(date).id,dailyTalk(new Date(2027,0,3)).id);
});
