const fs=require('fs'),vm=require('vm'),assert=require('assert');
const text=fs.readFileSync('outputs/torekh-guide.html','utf8');
const code=text.split('<script>')[1].split('</script>')[0];
const nodes={};
const node=()=>({style:{},value:'',open:false,hidden:false,textContent:'',innerHTML:'',dataset:{},setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){},querySelector(){return this.panel??=(node());},querySelectorAll(){return Array.from({length:4},node);}});
const doc={documentElement:{},querySelector:s=>nodes[s]??=node(),getElementById:s=>nodes[s]??=node()};
const win={addEventListener(){}};const ctx={document:doc,window:win,parent:win,URL,URLSearchParams,setTimeout(){},clearTimeout(){},console};
vm.createContext(ctx);vm.runInContext(code,ctx);
for(const lang of ['ar','en']){
 vm.runInContext(`lang='${lang}';render()`,ctx);
 assert.equal(doc.documentElement.dir,lang==='ar'?'rtl':'ltr');
 assert.equal((nodes['#cards'].innerHTML.match(/<article class="card"/g)||[]).length,37);
 const checks=vm.runInContext(`active.map(p=>({id:p.id,letters:p.letters,description:PARTY_TRANSLATIONS.descriptions[p.letters][lang],name:aliases[p.letters][lang==='ar'?1:0]}))`,ctx);
 for(const p of checks){
  assert(p.description&&p.name,'Missing list translation: '+p.letters);
  for(let n=0;n<4;n++){
   vm.runInContext(`panel(${JSON.stringify(p.id)},${n})`,ctx);
   const html=nodes[p.id].panel.innerHTML;
   assert(html.length>30,'Empty panel');
   if(n===0) assert(html.includes(p.description.replaceAll('&','&amp;').replaceAll("'",'&#39;')), 'Missing translated identity: '+p.letters);
   if(lang==='ar'&&n===1) assert(!html.includes('Read 23 Oct')&&!html.includes('publication date not'), 'English policy metadata leaked');
  }
 }
 assert(nodes['#blog-link'].href.includes('/'+lang+'/blog/'),'Blog language not retained');
}
const translations=JSON.parse(fs.readFileSync('outputs/party-translations.json','utf8'));
assert.equal(Object.keys(translations.descriptions).length,37);
assert.equal(Object.keys(translations.policySources).length,9);
const data=JSON.parse(fs.readFileSync('outputs/party-card-data.json','utf8'));
for(const p of Object.values(data.policies))for(const lang of ['ar','en'])assert.equal(p[lang].length,3);
console.log('Passed: 37 translated list descriptions in Arabic and English; 296 card-panel checks; nine localized source notes; 27 policy summaries per language; native-language blog links and RTL direction.');
