const fs=require('fs'),vm=require('vm'),assert=require('assert');
const text=fs.readFileSync('outputs/torekh-guide.html','utf8');
const code=text.split('<script>')[1].split('</script>')[0];
const nodes={};
const node=()=>({style:{},classList:{add(){},remove(){}},value:'',open:false,hidden:false,textContent:'',innerHTML:'',dataset:{},setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){},querySelector(){return this.panel??=(node());},querySelectorAll(){return Array.from({length:4},node);}});
const doc={documentElement:{},querySelector:s=>nodes[s]??=node(),getElementById:s=>nodes[s]??=node()};
const win={addEventListener(){}};const ctx={document:doc,window:win,parent:win,URL,URLSearchParams,setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},console};
vm.createContext(ctx);vm.runInContext(code,ctx);
for(const lang of ['ar','en']){
 vm.runInContext(`lang='${lang}';render()`,ctx);
 assert.equal(doc.documentElement.dir,lang==='ar'?'rtl':'ltr');
 assert.equal((nodes['#cards'].innerHTML.match(/<article class="card"/g)||[]).length,36);
 assert(nodes['#lead'].textContent.includes('36'));
 assert(nodes['#withdrawal-update'].innerHTML.includes('https://www.inn.co.il/news/709199'));
 assert(!nodes['#cards'].innerHTML.includes('id="chozrim-leshorashim_list32"'),'Withdrawn Ahi must not be active');
 assert(!nodes['#cards'].innerHTML.includes('role="tab"'),'Incomplete categories must not appear on cards');
 assert.equal((nodes['#cards'].innerHTML.match(/role="region"/g)||[]).length,36);
 const checks=vm.runInContext(`active.map(p=>({id:p.id,letters:p.letters,description:PARTY_TRANSLATIONS.descriptions[p.letters][lang],name:aliases[p.letters][lang==='ar'?1:0]}))`,ctx);
 for(const p of checks){
  assert(p.description&&p.name,'Missing list translation: '+p.letters);
  for(let n=0;n<1;n++){
   vm.runInContext(`panel(${JSON.stringify(p.id)},${n})`,ctx);
   const html=nodes[p.id].panel.innerHTML;
   assert(html.length>30,'Empty panel');
   if(n===0) assert(html.includes(p.description.replaceAll('&','&amp;').replaceAll("'",'&#39;')), 'Missing translated identity: '+p.letters);
   if(lang==='ar'&&n===1) assert(!html.includes('Read 23 Oct')&&!html.includes('publication date not'), 'English policy metadata leaked');
  }
 }
 assert(!nodes['#blog-link']?.href,'Unpublished article must not be promoted');
 assert.equal(nodes['#hero-static'].textContent,lang==='ar'?'دورك.':'Your turn.');
}
const translations=JSON.parse(fs.readFileSync('outputs/party-translations.json','utf8'));
assert(!text.includes('<details class="coalition-tools" open>'),'Coalition controls should start collapsed');
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
assert.deepEqual(data.profiles.filter(p=>!p.active).map(p=>p.letters).sort(),['כן','צבי'].sort(),'Only Blue and White and Ahi excluded');
assert.equal(data.profiles.find(p=>p.letters==='צבי').withdrawal.officialBallotRemovalVerified,false);
for(const p of Object.values(data.policies))for(const lang of ['ar','en'])assert.equal(p[lang].length,3);
vm.runInContext("lang='ru';renderHero()",ctx);
assert.equal(nodes['#hero-phrase'].textContent,'Твой ход.');
assert.equal(vm.runInContext('heroOrder.length',ctx),5);
vm.runInContext('heroMotion.matches=true;renderHero()',ctx);
assert.equal(vm.runInContext('heroInterval',ctx),null,'Reduced motion must stop rotation');
assert.equal(nodes['#hero-pause'].hidden,true);
console.log('Passed: 72 Arabic/English card backs; only Blue and White and Ahi inactive; sourced withdrawal notice and count 36; coalition, hero and retained research checks passed.');
