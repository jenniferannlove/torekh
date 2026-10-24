/*HERO_COPY*/
let heroOrder=[],heroIndex=0,heroPaused=false,heroInterval=null,heroFade=null;
const heroMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')||{matches:false,addEventListener(){}};
function heroStop(){clearInterval(heroInterval);clearTimeout(heroFade);heroInterval=null;heroFade=null;$('#hero-phrase').classList.remove('is-fading')}
function heroPaint(){const current=heroOrder[heroIndex]||lang,h=HERO_COPY[current];$('#hero-phrase').textContent=h.phrase;$('#hero-phrase').lang=current;$('#hero-phrase').dir=['he','ar'].includes(current)?'rtl':'ltr';$('#hero-language').textContent=h.language}
function heroControls(){const u=HERO_COPY[lang]||HERO_COPY.en;$('#hero-pause').hidden=heroMotion.matches;$('#hero-pause').textContent=heroPaused?u.resume:u.pause;$('#hero-pause').setAttribute('aria-pressed',String(heroPaused))}
function heroAdvance(){if(heroPaused||heroMotion.matches||document.hidden)return;$('#hero-phrase').classList.add('is-fading');heroFade=setTimeout(()=>{heroIndex=(heroIndex+1)%heroOrder.length;heroPaint();$('#hero-phrase').classList.remove('is-fading');heroFade=null},320)}
function heroStart(){heroStop();if(!heroPaused&&!heroMotion.matches)heroInterval=setInterval(heroAdvance,6000)}
function renderHero(){heroStop();heroOrder=[lang,...['he','ar','en','ru','am'].filter(x=>x!==lang)];heroIndex=0;$('#hero-static').textContent=(HERO_COPY[lang]||HERO_COPY.en).phrase.replace('\n',' ');heroPaint();heroControls();heroStart()}
$('#hero-pause').addEventListener('click',()=>{heroPaused=!heroPaused;heroControls();heroStart()});
heroMotion.addEventListener?.('change',()=>{heroStop();if(heroMotion.matches){heroIndex=0;heroPaint()}heroControls();heroStart()});
