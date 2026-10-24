const fs=require('fs'),vm=require('vm'),assert=require('assert');
const text=fs.readFileSync('outputs/torekh-guide.html','utf8');
const code=text.split('<script>')[1].split('</script>')[0];
const nodes={};
const node=()=>({style:{},classList:{add(){},remove(){}},value:'',open:false,hidden:false,textContent:'',innerHTML:'',dataset:{},setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){},querySelector(){return this.panel??=(node());},querySelectorAll(){return Array.from({length:4},node);}});
const doc={documentElement:{},querySelector:s=>nodes[s]??=node(),getElementById:s=>nodes[s]??=node()};
const win={addEventListener(){}};const ctx={document:doc,window:win,parent:win,URL,URLSearchParams,setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},console};
vm.createContext(ctx);vm.runInContext(code,ctx);
assert.equal((nodes['#cards'].innerHTML.match(/<article class="card"/g)||[]).length,15,'Default overview includes all 15 reported lists');
nodes['#search'].value='צף';vm.runInContext('filter()',ctx);
assert(nodes['#cards'].innerHTML.includes('pirates_list_5'),'Search includes lists outside quick view');
nodes['#search'].value='';vm.runInContext("viewMode='all'",ctx);
for(const lang of ['ar','en']){
 vm.runInContext(`lang='${lang}';render()`,ctx);
 assert.equal(doc.documentElement.dir,lang==='ar'?'rtl':'ltr');
 assert.equal((nodes['#cards'].innerHTML.match(/<article class="card"/g)||[]).length,35);
 assert(nodes['#lead'].textContent.includes('35'));
 assert(nodes['#verification'].textContent.includes(lang==='ar'?'24 أكتوبر 2026':'24 Oct 2026'));
 assert(nodes['#withdrawal-update'].innerHTML.includes('https://www.inn.co.il/news/709199'));
 assert(!nodes['#cards'].innerHTML.includes('id="chozrim-leshorashim_list32"'),'Withdrawn Ahi must not be active');
 assert(!nodes['#cards'].innerHTML.includes('role="tab"'),'Incomplete categories must not appear on cards');
 assert(!nodes['#cards'].innerHTML.includes('Unofficial reading aid'),'Remove redundant reading-aid label');
 assert(!nodes['#cards'].innerHTML.includes('Official list details checked'),'Use shorter date label');
 if(lang==='en')assert.equal((nodes['#cards'].innerHTML.match(/Last update:/g)||[]).length,35);
 assert.equal((nodes['#cards'].innerHTML.match(/role="region"/g)||[]).length,35);
 const checks=vm.runInContext(`active.map(p=>({id:p.id,letters:p.letters,description:PARTY_TRANSLATIONS.descriptions[p.letters][lang],name:aliases[p.letters][lang==='ar'?1:0]}))`,ctx);
 for(const p of checks){
  assert(p.description&&p.name,'Missing list translation: '+p.letters);
  for(let n=0;n<1;n++){
   vm.runInContext(`panel(${JSON.stringify(p.id)},${n})`,ctx);
   const html=nodes[p.id].panel.innerHTML;
   assert(html.length>30,'Empty panel');
   assert(html.includes('party-intro')&&html.includes('intro-sources')&&html.includes('registration'),'Introduction, sources and original registration must be available');
   if(n===0) assert(html.includes(p.description.replaceAll('&','&amp;').replaceAll("'",'&#39;')), 'Missing translated identity: '+p.letters);
   if(lang==='ar'&&n===1) assert(!html.includes('Read 23 Oct')&&!html.includes('publication date not'), 'English policy metadata leaked');
  }
 }
 assert(!nodes['#blog-link']?.href,'Unpublished article must not be promoted');
 assert.equal(nodes['#hero-static'].textContent,lang==='ar'?'دوركِ. الأوراق على الطاولة.':'Your turn. Cards on the table.');
}
assert(!text.includes('id="coalition-context"')&&!text.includes('id="coalition-sort"'),'Remove remote colour and sorting controls');
assert(!text.includes('id="coalition-legend"'),'Do not leave an unused colour key');
vm.runInContext("coalitionFocus='off';coalitionSelected=new Set(['מחל','אמת']);renderScenario()",ctx);
assert(nodes['#coalition-warnings'].innerHTML.includes('<li'),'Netanyahu-related checked evidence must follow the selected lists independently of removed controls');
vm.runInContext("coalitionSelected=new Set(['מחל']);renderScenario()",ctx);
assert(!nodes['#coalition-warnings'].innerHTML.includes('<li'),'A refusal requires both selected sides');
const translations=JSON.parse(fs.readFileSync('outputs/party-translations.json','utf8'));
assert(!text.includes('<select id="coalition-context"'),'Reference picker must use buttons');
assert(!text.includes('<select id="coalition-preset"'),'Scenario examples must use buttons');
assert.equal((nodes['#scenario-tiles'].innerHTML.match(/class="scenario-tile"/g)||[]).length,35);
assert(!nodes['#scenario-tiles'].innerHTML.includes('data-pick="רץ"'));
vm.runInContext("coalitionSelected=new Set(['דרך','רק','אמת','ל']);renderScenario()",ctx);
assert.equal((nodes['#scenario-tiles'].innerHTML.match(/aria-pressed="true"/g)||[]).length,4);
assert(nodes['#coalition-total'].innerHTML.includes('56 / 120'),'Four-list example totals the dated poll correctly');
for(const language of ['he','ar','en','ru','am']){
 vm.runInContext(`lang='${language}';coalitionFocus='leader:netanyahu'`,ctx);
 const badges=vm.runInContext('active.map(p=>({status:relation(p).status,html:coalitionBadge(p)}))',ctx);
 assert(badges.some(b=>b.status==='unknown'));
 assert(badges.some(b=>b.html.includes('data-stance="refuse"')),'Sourced refusal must remain available');
 for(const b of badges)if(b.status==='unknown')assert.equal(b.html,'','Missing evidence must not produce a badge');
}
assert.equal(Object.keys(translations.descriptions).length,37);
assert.equal(Object.keys(translations.policySources).length,9);
const data=JSON.parse(fs.readFileSync('outputs/party-card-data.json','utf8'));
assert.deepEqual(data.profiles.filter(p=>!p.active).map(p=>p.letters).sort(),['כן','צבי','רץ'].sort(),'Only the three sourced withdrawals excluded');
assert.equal(data.profiles.find(p=>p.letters==='רץ').withdrawal.officialBallotRemovalVerified,false);
const audit=JSON.parse(fs.readFileSync('outputs/torekh-party-check-2026-10-24.json','utf8'));
assert.equal(audit.entries.length,38);
assert(audit.entries.every(e=>e.nameMatches&&e.lettersMatch));
assert.equal(audit.entries.filter(e=>e.displayStatus==='active').length,35);
assert.equal(data.profiles.find(p=>p.letters==='צבי').withdrawal.officialBallotRemovalVerified,false);
for(const p of Object.values(data.policies))for(const lang of ['ar','en'])assert.equal(p[lang].length,3);
vm.runInContext("lang='ru';renderHero()",ctx);
assert.equal(nodes['#hero-phrase'].textContent,'Твой ход.\nКарты на стол.');
assert.equal(vm.runInContext('heroOrder.length',ctx),5);
vm.runInContext('heroMotion.matches=true;renderHero()',ctx);
assert.equal(vm.runInContext('heroInterval',ctx),null,'Reduced motion must stop rotation');
assert.equal(nodes['#hero-pause'].hidden,true);
const introductions=JSON.parse(fs.readFileSync('outputs/party-introductions.json','utf8')).records;
assert.equal(Object.keys(introductions).length,35);
for(const p of data.profiles.filter(p=>p.active))for(const l of ['ar','he','en'])assert(introductions[p.letters][l].length>30);
console.log('Passed: 35 three-language introductions; quick overview and all-list search; 70 Arabic/English card backs; 38 official name/letter matches; three sourced exclusions; verification date 24 Oct; coalition, hero and retained research checks passed.');
