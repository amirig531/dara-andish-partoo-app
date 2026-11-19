import vehicles from './vehicles.json';
import './style.css';

const app = document.querySelector('#app');
const state = { view: 'home', selected: null, query: '', category: 'همه', tab: 'cars' };
const categories = ['همه', ...new Set(vehicles.flatMap(v => v.sections.map(s => s.name)))];
const normalize = s => (s || '').toString().toLocaleLowerCase('fa').replace(/ي/g,'ی').replace(/ك/g,'ک').trim();
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const totalParts = vehicles.reduce((n,v)=>n+v.sections.reduce((m,s)=>m+s.parts.length,0),0);

function header() {
 return `<header class="topbar"><button class="brand" data-action="home"><img src="/brand-logo.png" alt="لوگوی دارا اندیش پرتو"><span><b>دارا اندیش پرتو</b><small>کاتالوگ خودرو و قطعات</small></span></button><button class="menu-btn" data-action="about" aria-label="درباره ما">درباره مجموعه</button></header>`;
}
function footer() {
 return `<footer><div class="footer-brand"><img src="/brand-logo.png"><div><b>مجموعه بازرگانی دارا اندیش پرتو</b><small>تأمین و واردات قطعات خودرو</small></div></div><p>تهران – شهران – بین فلکه دوم و سوم – ساختمان ماهان</p><small class="muted">اطلاعات خودروها و قطعات بر اساس کاتالوگ ارائه‌شده مجموعه</small></footer>`;
}
function shell(content) { app.innerHTML = `${header()}<main>${content}</main>${footer()}<nav class="bottom-nav"><button data-action="home" class="${state.view==='home'?'active':''}">⌂<span>خودروها</span></button><button data-action="parts" class="${state.view==='parts'?'active':''}">⌕<span>جستجوی قطعه</span></button><button data-action="about" class="${state.view==='about'?'active':''}">◎<span>تماس با ما</span></button></nav>`; }
function vehicleCard(v) {
 const count=v.sections.reduce((n,s)=>n+s.parts.length,0);
 return `<button class="vehicle-card" data-vehicle="${v.id}"><div class="vehicle-image"><img src="${v.image}" alt="${escapeHtml(v.name)}" loading="lazy"></div><div class="vehicle-meta"><b>${escapeHtml(v.name)}</b><span>${v.sections.length} گروه قطعه <i>•</i> ${count} قلم</span></div><span class="arrow">←</span></button>`;
}
function home() {
 const q=normalize(state.query);
 const filtered=vehicles.filter(v=>!q||normalize(v.name).includes(q)||v.sections.some(s=>normalize(s.name+' '+s.parts.join(' ')).includes(q)));
 shell(`<section class="hero"><div class="hero-copy"><span class="eyebrow">DARA ANDISH PARTOO</span><h1>قطعه‌ی موردنیازتان<br><em>را سریع‌تر پیدا کنید</em></h1><p>فهرست خودروهای تحت پوشش و قطعات قابل تأمین، یک‌جا و همیشه در دسترس.</p><div class="hero-stats"><div><b>${vehicles.length}</b><small>مدل خودرو</small></div><div><b>${totalParts.toLocaleString('fa-IR')}</b><small>قلم قطعه</small></div></div></div><div class="hero-art"><img src="/brand-logo.png" alt=""></div></section>
 <section class="section-head"><div><span class="eyebrow">CATALOG</span><h2>خودروهای تحت پوشش</h2><p>خودرو را انتخاب کنید تا قطعات آن را ببینید.</p></div><span class="count-pill">${filtered.length} خودرو</span></section>
 <div class="search-wrap"><span>⌕</span><input id="search" value="${escapeHtml(state.query)}" placeholder="جستجوی نام خودرو یا قطعه..." autocomplete="off"><button data-action="clear-search" aria-label="پاک کردن">×</button></div>
 <div class="vehicle-grid">${filtered.map(vehicleCard).join('') || `<div class="empty">موردی با این عبارت پیدا نشد.</div>`}</div>`);
}
function detail(v) {
 const q=normalize(state.query);
 const sections=v.sections.map(s=>({...s,parts:s.parts.filter(p=>!q||normalize(p).includes(q))})).filter(s=>s.parts.length);
 shell(`<button class="back" data-action="home">→ بازگشت به فهرست خودروها</button><section class="detail-hero"><img src="${v.image}" alt="${escapeHtml(v.name)}"><div><span class="eyebrow">VEHICLE DETAILS</span><h1>${escapeHtml(v.name)}</h1><p>${v.sections.length} گروه قطعه در فهرست این خودرو ثبت شده است.</p><div class="detail-tags"><span>فهرست قطعات</span><span>قابل جستجو</span></div></div></section>
 <div class="search-wrap detail-search"><span>⌕</span><input id="search" value="${escapeHtml(state.query)}" placeholder="جستجو در قطعات ${escapeHtml(v.name)}..."><button data-action="clear-search">×</button></div>
 <div class="section-list">${sections.map((s,i)=>`<details class="part-group" ${i===0?'open':''}><summary><span class="group-icon">${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(s.name)}</b><span class="part-count">${s.parts.length} قطعه</span><span class="chevron">⌄</span></summary><ul>${s.parts.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></details>`).join('')||'<div class="empty">قطعه‌ای با این عبارت در این خودرو پیدا نشد.</div>'}</div>`);
}
function partsPage() {
 const q=normalize(state.query);
 const hits=[];
 if(q) vehicles.forEach(v=>v.sections.forEach(s=>s.parts.forEach(p=>{if(normalize(p).includes(q)||normalize(s.name).includes(q)) hits.push({v,s,p});})));
 shell(`<section class="page-intro"><span class="eyebrow">PART FINDER</span><h1>جستجوی قطعات</h1><p>نام قطعه را وارد کنید تا خودروهایی که این قطعه در فهرست آن‌ها آمده نمایش داده شوند.</p></section>
 <div class="search-wrap"><span>⌕</span><input id="search" value="${escapeHtml(state.query)}" placeholder="مثلاً: چراغ جلو، واترپمپ، سپر..." autofocus><button data-action="clear-search">×</button></div>
 ${q?`<div class="results-head">نتایج جستجو <span>${hits.length} مورد</span></div><div class="results-list">${hits.slice(0,150).map(h=>`<button class="result-row" data-vehicle="${h.v.id}"><span class="result-icon">⚙</span><span><b>${escapeHtml(h.p)}</b><small>${escapeHtml(h.v.name)} <i>·</i> ${escapeHtml(h.s.name)}</small></span><span class="arrow">←</span></button>`).join('')||'<div class="empty">نتیجه‌ای پیدا نشد. عبارت دیگری را امتحان کنید.</div>'}</div>`:`<div class="search-hint"><span>⌕</span><b>جستجو در فهرست قطعات همه خودروها</b><p>برای نمونه نام یک قطعه مانند «لنت ترمز» یا «رادیاتور» را وارد کنید.</p></div>`}`);
}
function about() {
 shell(`<section class="about-hero"><img src="/brand-logo.png" alt="لوگو"><span class="eyebrow">ABOUT DARA ANDISH PARTOO</span><h1>مجموعه بازرگانی<br>دارا اندیش پرتو</h1><p>کاتالوگ دیجیتال خودروها و قطعات قابل تأمین مجموعه</p></section><section class="contact-card"><span class="eyebrow">CONTACT & ADDRESS</span><h2>راه‌های ارتباطی</h2><div class="contact-line"><span class="contact-icon">⌖</span><div><small>نشانی مجموعه</small><b>تهران – شهران – بین فلکه دوم و سوم – ساختمان ماهان</b></div></div><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('تهران شهران بین فلکه دوم و سوم ساختمان ماهان')}" target="_blank" rel="noreferrer">مشاهده موقعیت روی نقشه <span>↗</span></a><p class="notice">شماره تماس، قیمت و موجودی در فایل معرفی ارائه نشده است؛ برای دریافت اطلاعات به‌روز با مجموعه تماس بگیرید.</p></section>`);
}
function render() {
 if(state.view==='detail') { const v=vehicles.find(x=>x.id===state.selected); if(v) return detail(v); state.view='home'; }
 if(state.view==='parts') return partsPage();
 if(state.view==='about') return about();
 home();
}
app.addEventListener('click',e=>{
 const vehicle=e.target.closest('[data-vehicle]');
 if(vehicle){state.selected=vehicle.dataset.vehicle;state.query='';state.view='detail';render();return;}
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(action==='home'){state.view='home';state.query='';render();}
 if(action==='parts'){state.view='parts';state.query='';render();document.querySelector('#search')?.focus();}
 if(action==='about'){state.view='about';render();}
 if(action==='clear-search'){state.query='';render();document.querySelector('#search')?.focus();}
});
app.addEventListener('input',e=>{if(e.target.id==='search'){const pos=e.target.selectionStart;state.query=e.target.value;const y=window.scrollY;render();const input=document.querySelector('#search');input?.focus();input?.setSelectionRange(pos,pos);window.scrollTo(0,y);}});
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
