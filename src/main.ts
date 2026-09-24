import './style.css';
import { Character, CharacterClass } from './models/Character';
import { Warrior } from './models/Warrior';
import { Mage } from './models/Mage';
import { Archer } from './models/Archer';
import { Item, ItemType } from './models/Item';
import { Weapon } from './models/Weapon';
import { Armor } from './models/Armor';
import { Potion } from './models/Potion';
import { Battle } from './services/Battle';
import { defaultCharacters, defaultItems } from './data/defaults';
import { loadCharacters, loadItems, loadHistory, makeCharacter, makeItem, saveCharacters, saveHistory, saveItems, BattleHistory } from './storage';

const app = document.querySelector<HTMLDivElement>('#app')!;
let characters = loadCharacters();
let items = loadItems();
let history = loadHistory();
if (!characters.length) { characters = defaultCharacters(); saveCharacters(characters); }
if (!items.length) { items = defaultItems(); saveItems(items); }

let activePage = 'dashboard';
let editingId: string | null = null;
let selectedAttacker = characters[0]?.getId() ?? '';
let selectedDefender = characters[1]?.getId() ?? '';

function esc(value: string): string {
  return value.replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]!));
}
function uid(prefix: string): string { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function persist(): void { saveCharacters(characters); saveItems(items); saveHistory(history); }
function findCharacter(id: string): Character | undefined { return characters.find(c => c.getId() === id); }
function badge(type: string): string { return `<span class="badge badge-${type.toLowerCase()}">${esc(type)}</span>`; }

function render(): void {
  app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">⚔</div><div><strong>RPG</strong><span>Character Manager</span></div></div>
      <nav>
        ${navItem('dashboard','⌂','Dashboard')}
        ${navItem('characters','⚔','Characters')}
        ${navItem('inventory','🎒','Inventory')}
        ${navItem('skills','✦','Skills')}
        ${navItem('battle','⚡','Battle Arena')}
        ${navItem('history','◷','Battle History')}
      </nav>
      <div class="sidebar-foot"><div class="status-dot"></div> System Online</div>
    </aside>
    <main class="main">
      <header class="topbar"><div><p class="eyebrow">OOP MINI PROJECT</p><h1>${pageTitle()}</h1></div><div class="top-actions"><span class="date">${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span></div></header>
      <section class="content">${pageContent()}</section>
    </main>
  </div>`;
  bindEvents();
}

function navItem(id:string, icon:string, label:string): string { return `<button class="nav-item ${activePage===id?'active':''}" data-page="${id}"><span>${icon}</span>${label}</button>`; }
function pageTitle(): string { return ({dashboard:'Dashboard',characters:'Character Management',inventory:'Inventory',skills:'Skills',battle:'Battle Arena',history:'Battle History'} as Record<string,string>)[activePage]; }

function pageContent(): string {
  switch(activePage) {
    case 'characters': return charactersPage();
    case 'inventory': return inventoryPage();
    case 'skills': return skillsPage();
    case 'battle': return battlePage();
    case 'history': return historyPage();
    default: return dashboardPage();
  }
}

function dashboardPage(): string {
  const avg = characters.length ? Math.round(characters.reduce((s,c)=>s+c.getLevel(),0)/characters.length) : 0;
  const last = history[0];
  return `<div class="hero"><div><p class="eyebrow">WELCOME, ADVENTURER</p><h2>Manage your heroes.<br><span>Build. Battle. Improve.</span></h2><p>ระบบจัดการตัวละคร RPG สำหรับสาธิตแนวคิด Object-Oriented Programming พร้อม GUI และการทำงานจริง</p><button class="primary" data-page="characters">Manage Characters →</button></div><div class="hero-art"><div class="orb">⚔</div><div class="ring r1"></div><div class="ring r2"></div></div></div>
  <div class="stats"><div class="stat"><span>Characters</span><strong>${characters.length}</strong><small>registered heroes</small></div><div class="stat"><span>Avg. Level</span><strong>${avg}</strong><small>across all heroes</small></div><div class="stat"><span>Items</span><strong>${items.length}</strong><small>in inventory</small></div><div class="stat"><span>Battles</span><strong>${history.length}</strong><small>simulations completed</small></div></div>
  <div class="grid-2"><div class="panel"><div class="panel-head"><div><p class="eyebrow">ROSTER</p><h3>Active Characters</h3></div><button class="ghost" data-page="characters">View all</button></div>${characters.slice(0,3).map(characterRow).join('')}</div><div class="panel"><div class="panel-head"><div><p class="eyebrow">RECENT</p><h3>Latest Battle</h3></div></div>${last ? `<div class="battle-result"><div class="trophy">🏆</div><div><strong>${esc(last.winner)}</strong><span>defeated ${esc(last.loser)} in ${last.rounds} rounds</span><small>${new Date(last.date).toLocaleString()}</small></div></div>` : `<div class="empty">No battle has been recorded yet.<br>Try the Battle Arena.</div>`}</div></div>`;
}

function characterRow(c: Character): string { return `<div class="row"><div class="avatar ${c.getClassName().toLowerCase()}">${c.getClassName()[0]}</div><div class="row-main"><strong>${esc(c.getName())}</strong><span>${badge(c.getClassName())} · Lv.${c.getLevel()}</span></div><div class="row-stat"><span>HP</span><strong>${c.getHp()}</strong></div><button class="icon-btn" data-view="${c.getId()}">→</button></div>`; }

function charactersPage(): string {
  return `<div class="toolbar"><div class="search"><span>⌕</span><input id="search" placeholder="Search characters..." /></div><button class="primary" data-action="add-character">+ Add Character</button></div>
  <div id="character-list" class="cards-grid">${renderCharacterCards(characters)}</div>
  <div id="modal-root"></div>`;
}

function renderCharacterCards(list: Character[]): string {
  if (!list.length) return `<div class="empty full">No characters found.</div>`;
  return list.map(c => `<article class="character-card"><div class="card-top"><div class="avatar large ${c.getClassName().toLowerCase()}">${c.getClassName()[0]}</div><div><h3>${esc(c.getName())}</h3><p>${badge(c.getClassName())} <span class="muted">Lv.${c.getLevel()}</span></p></div><button class="menu-btn" data-view="${c.getId()}">⋮</button></div><p class="desc">${esc(c.getDescription()) || 'No description.'}</p><div class="bars"><div><div class="bar-label"><span>HP</span><strong>${c.getHp()} / ${c.getMaxHp()}</strong></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,c.getHp()/c.getMaxHp()*100))}%"></i></div></div></div><div class="mini-stats"><div><span>ATK</span><strong>${c.getAttackPower()}</strong></div><div><span>DEF</span><strong>${c.getDefense()}</strong></div><div><span>SKILL</span><strong>${esc(c.getSpecialSkill())}</strong></div></div><div class="card-actions"><button data-edit="${c.getId()}">Edit</button><button class="danger-text" data-delete="${c.getId()}">Delete</button></div></article>`).join('');
}

function characterModal(c?: Character): string {
  const isEdit = !!c;
  return `<div class="modal-backdrop" id="modal"><div class="modal"><button class="close" data-action="close-modal">×</button><p class="eyebrow">${isEdit?'EDIT CHARACTER':'NEW CHARACTER'}</p><h2>${isEdit?'Update hero':'Create a hero'}</h2><form id="character-form"><label>Name<input name="name" required maxlength="24" value="${c?esc(c.getName()):''}" placeholder="e.g. Aether" /></label><label>Class<select name="class" ${isEdit?'disabled':''}><option ${c?.getClassName()==='Warrior'?'selected':''}>Warrior</option><option ${c?.getClassName()==='Mage'?'selected':''}>Mage</option><option ${c?.getClassName()==='Archer'?'selected':''}>Archer</option></select></label><label>Level<input name="level" type="number" min="1" max="99" value="${c?.getLevel() ?? 1}" /></label><label>Description<textarea name="description" rows="3" maxlength="120" placeholder="Describe this character...">${c?esc(c.getDescription()):''}</textarea></label><div class="form-actions"><button type="button" class="ghost" data-action="close-modal">Cancel</button><button class="primary" type="submit">${isEdit?'Save Changes':'Create Character'}</button></div></form></div></div>`;
}

function inventoryPage(): string {
  return `<div class="toolbar"><div><p class="eyebrow">ITEM MANAGEMENT</p><h2 class="section-title">Inventory</h2></div><button class="primary" data-action="add-item">+ Add Item</button></div><div class="cards-grid">${items.map(i=>`<article class="item-card"><div class="item-icon ${i.getType().toLowerCase()}">${i.getType()==='Weapon'?'⚔':i.getType()==='Armor'?'🛡':'🧪'}</div><div class="item-body"><div class="card-top"><div><h3>${esc(i.getName())}</h3><p>${badge(i.getType())}</p></div></div><p class="desc">${esc(i.getDescription())}</p><div class="item-value"><span>Effect value</span><strong>${i.getValue()} ${i.getType()==='Potion'?'HP':''}</strong></div><div class="card-actions"><button data-use-item="${i.getId()}">Use Item</button><button class="danger-text" data-delete-item="${i.getId()}">Delete</button></div></div></article>`).join('')}</div><div id="modal-root"></div>`;
}

function skillsPage(): string {
  const skills = [{name:'Shield Bash',type:'Warrior',effect:'Heavy defense-based strike',power:'DEF + ATK'},{name:'Arcane Blast',type:'Mage',effect:'High magic damage',power:'ATK + 35'},{name:'Piercing Arrow',type:'Archer',effect:'Ranged piercing attack',power:'ATK + 20'}];
  return `<div class="info-banner"><span>✦</span><div><strong>Polymorphism Demo</strong><p>Each character class overrides <code>attack()</code> with its own damage calculation. Select a hero in Battle Arena to see the behavior.</p></div></div><div class="skills-grid">${skills.map(s=>`<article class="skill-card"><div class="skill-icon">✦</div><div>${badge(s.type)}<h3>${s.name}</h3><p>${s.effect}</p><div class="skill-power">Power <strong>${s.power}</strong></div></div></article>`).join('')}</div>`;
}

function battlePage(): string {
  const options = characters.map(c=>`<option value="${c.getId()}">${esc(c.getName())} — ${c.getClassName()}</option>`).join('');
  return `<div class="battle-layout"><div class="panel battle-panel"><div class="panel-head"><div><p class="eyebrow">SIMULATION</p><h3>Choose Fighters</h3></div><span class="live">● READY</span></div><div class="fighter-select"><label>Attacker<select id="attacker">${options}</select></label><div class="vs">VS</div><label>Defender<select id="defender">${options}</select></label></div><button class="primary wide" data-action="start-battle">⚡ Start Battle</button><div id="battle-output" class="battle-output"><div class="arena-placeholder">Select two characters and start the simulation.</div></div></div><div class="panel"><div class="panel-head"><div><p class="eyebrow">RULES</p><h3>How Battle Works</h3></div></div><ul class="rules"><li>Each class has a different <code>attack()</code> implementation.</li><li>Damage considers the attacker's stats and defender's defense.</li><li>The battle alternates turns until one character reaches 0 HP.</li><li>Every completed battle is saved to Battle History.</li></ul></div></div>`;
}

function historyPage(): string {
  return `<div class="panel"><div class="panel-head"><div><p class="eyebrow">RECORDS</p><h3>Battle History</h3></div><span class="muted">${history.length} record(s)</span></div>${history.length ? `<div class="history-list">${history.map((h,i)=>`<div class="history-row"><div class="history-no">${String(history.length-i).padStart(2,'0')}</div><div class="history-main"><strong>🏆 ${esc(h.winner)}</strong><span>defeated ${esc(h.loser)}</span></div><div class="history-rounds">${h.rounds} rounds</div><div class="history-date">${new Date(h.date).toLocaleString()}</div></div>`).join('')}</div>` : `<div class="empty">No battle records yet.</div>`}</div>`;
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-page]').forEach(el => el.addEventListener('click', () => { activePage = el.dataset.page!; render(); }));
  document.querySelectorAll<HTMLElement>('[data-action="add-character"]').forEach(el => el.addEventListener('click', () => openCharacterModal()));
  document.querySelectorAll<HTMLElement>('[data-action="close-modal"]').forEach(el => el.addEventListener('click', () => document.querySelector('#modal')?.remove()));
  document.querySelectorAll<HTMLElement>('[data-edit]').forEach(el => el.addEventListener('click', () => { editingId = el.dataset.edit!; openCharacterModal(findCharacter(editingId)); }));
  document.querySelectorAll<HTMLElement>('[data-delete]').forEach(el => el.addEventListener('click', () => deleteCharacter(el.dataset.delete!)));
  document.querySelectorAll<HTMLElement>('[data-view]').forEach(el => el.addEventListener('click', () => { activePage='characters'; editingId=el.dataset.view!; render(); openCharacterModal(findCharacter(editingId)); }));
  const search = document.querySelector<HTMLInputElement>('#search');
  search?.addEventListener('input', () => { const q=search.value.toLowerCase(); const list=characters.filter(c=>c.getName().toLowerCase().includes(q)||c.getClassName().toLowerCase().includes(q)); const root=document.querySelector('#character-list'); if(root) root.innerHTML=renderCharacterCards(list); bindCharacterCardEvents(); });
  bindCharacterCardEvents();
  document.querySelector('[data-action="add-item"]')?.addEventListener('click', addItem);
  document.querySelectorAll<HTMLElement>('[data-use-item]').forEach(el => el.addEventListener('click', () => alert(items.find(i=>i.getId()===el.dataset.useItem)?.use() ?? 'Item not found')));
  document.querySelectorAll<HTMLElement>('[data-delete-item]').forEach(el => el.addEventListener('click', () => { items=items.filter(i=>i.getId()!==el.dataset.deleteItem); persist(); render(); }));
  document.querySelector('[data-action="start-battle"]')?.addEventListener('click', startBattle);
}
function bindCharacterCardEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-edit]').forEach(el => el.onclick = () => { editingId=el.dataset.edit!; openCharacterModal(findCharacter(editingId)); });
  document.querySelectorAll<HTMLElement>('[data-delete]').forEach(el => el.onclick = () => deleteCharacter(el.dataset.delete!));
}
function openCharacterModal(c?: Character): void { const root=document.querySelector('#modal-root'); if(root) { root.innerHTML=characterModal(c); document.querySelector('#character-form')?.addEventListener('submit', submitCharacter); } }
function submitCharacter(e: Event): void { e.preventDefault(); const form=e.target as HTMLFormElement; const fd=new FormData(form); const name=String(fd.get('name')||'').trim(); const level=Math.max(1,Number(fd.get('level'))||1); const description=String(fd.get('description')||'').trim(); const className=String(fd.get('class')) as CharacterClass; if(!name) return; if(editingId){ const c=findCharacter(editingId); if(c){c.setName(name); c.setLevel(level); c.setDescription(description);} } else { const hp=className==='Warrior'?1200:className==='Mage'?820:950; const atk=className==='Warrior'?230:className==='Mage'?280:250; const def=className==='Warrior'?90:className==='Mage'?45:65; const data={id:uid('c'),name,level,hp:hp+(level-1)*25,maxHp:hp+(level-1)*25,attackPower:atk+(level-1)*5,defense:def+(level-1)*3,description}; characters.push(makeCharacter(className,data)); } editingId=null; persist(); render(); }
function deleteCharacter(id:string): void { const c=findCharacter(id); if(!c) return; if(!confirm(`Delete ${c.getName()}?`)) return; characters=characters.filter(x=>x.getId()!==id); if(selectedAttacker===id) selectedAttacker=characters[0]?.getId()??''; if(selectedDefender===id) selectedDefender=characters[1]?.getId()??characters[0]?.getId()??''; persist(); render(); }
function addItem(): void { const name=prompt('Item name:', 'New Potion')?.trim(); if(!name) return; const type=(prompt('Type: Weapon / Armor / Potion','Potion')||'Potion') as ItemType; const safe:ItemType=['Weapon','Armor','Potion'].includes(type)?type:'Potion'; const value=Number(prompt('Effect value:', safe==='Potion'?'200':'25'))||25; const data={id:uid('i'),name,type:safe,value,description:'Custom item created from Inventory.'}; items.push(makeItem(safe,data)); persist(); render(); }
function startBattle(): void { const aId=document.querySelector<HTMLSelectElement>('#attacker')?.value; const dId=document.querySelector<HTMLSelectElement>('#defender')?.value; const a=findCharacter(aId||''); const d=findCharacter(dId||''); const out=document.querySelector('#battle-output'); if(!a||!d||a===d){if(out)out.innerHTML='<div class="error-box">Please choose two different characters.</div>';return;} const result=new Battle().simulate(a,d); history.unshift({id:uid('b'),date:new Date().toISOString(),winner:result.winner,loser:result.loser,rounds:result.rounds}); persist(); if(out) out.innerHTML=`<div class="battle-final"><div class="winner">🏆 <strong>${esc(result.winner)}</strong> wins!</div><p>${esc(result.loser)} was defeated in ${result.rounds} rounds.</p><details><summary>View battle log</summary><div class="log">${result.log.map(esc).join('<br>')}</div></details></div>`; }

render();
