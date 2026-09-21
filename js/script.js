(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const N0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const N1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const pl = (n, s, p) => `${N0.format(n)} ${n === 1 ? s : p}`;

const NEW_PRICE = 120, WATER = 2700, INVEST = [5000, 10000];
const COSTS = [
  { cat: 'Operacional', item: 'Aluguel de espaço / manutenção', kind: 'Fixo', v: 1200 },
  { cat: 'Higienização', item: 'Produtos de lavanderia', kind: 'Variável', v: 350 },
  { cat: 'Marketing', item: 'Anúncios locais e designs', kind: 'Fixo', v: 200 },
  { cat: 'Insumos', item: 'Tags, cabides e sacolas de papel', kind: 'Variável', v: 150 },
];
const COST = COSTS.reduce((a, c) => a + c.v, 0); // 1900

const PLANS = [
  { id: 'essencial', name: 'Essencial', price: 79.90, pieces: 3, wash: false, note: 'Para começar a variar o guarda-roupa.', tag: 'Menor mensalidade' },
  { id: 'basico', name: 'Básico', price: 119.90, pieces: 5, wash: false, note: 'Mais variedade no dia a dia.', tag: '' },
  { id: 'premium', name: 'Premium', price: 159.90, pieces: 7, wash: true, note: 'Para quem quer variedade máxima.', tag: 'Menor custo por peça' },
];
const plan = id => PLANS.find(p => p.id === id);
const perPiece = p => p.price / (p.pieces * 4);

const PIECES = [
  { id: 'p1', name: 'Camiseta básica', cat: 'Parte de cima', ic: 'tee', bg: '#e6e2cf', fg: '#2a2818' },
  { id: 'p2', name: 'Camisa listrada', cat: 'Parte de cima', ic: 'shirt', bg: '#2b3b50', fg: '#dbe4ee' },
  { id: 'p3', name: 'Cropped canelado', cat: 'Parte de cima', ic: 'crop', bg: '#6b2d3a', fg: '#f3dade' },
  { id: 'p4', name: 'Moletom oversized', cat: 'Casacos', ic: 'hoodie', bg: '#3b4636', fg: '#dde6d3' },
  { id: 'p5', name: 'Jaqueta jeans', cat: 'Casacos', ic: 'jacket', bg: '#3d5a80', fg: '#e2edf8' },
  { id: 'p6', name: 'Blazer de alfaiataria', cat: 'Casacos', ic: 'blazer', bg: '#2a2620', fg: '#d9c9a3' },
  { id: 'p7', name: 'Calça jeans reta', cat: 'Parte de baixo', ic: 'pants', bg: '#2f4661', fg: '#b9cbe0' },
  { id: 'p8', name: 'Shorts de sarja', cat: 'Parte de baixo', ic: 'shorts', bg: '#b29b6e', fg: '#3a2f16' },
  { id: 'p9', name: 'Saia midi plissada', cat: 'Parte de baixo', ic: 'skirt', bg: '#6d4f7c', fg: '#eadcf2' },
  { id: 'p10', name: 'Vestido de verão', cat: 'Vestidos', ic: 'dress', bg: '#d9d0a8', fg: '#5b4d00' },
  { id: 'p11', name: 'Vestido preto', cat: 'Vestidos', ic: 'dress', bg: '#1d1d1d', fg: '#ececec' },
  { id: 'p12', name: 'Calça de alfaiataria', cat: 'Parte de baixo', ic: 'pants', bg: '#cfc8b4', fg: '#3b382b' },
];
const piece = id => PIECES.find(p => p.id === id);
const ico = (name, style = '') => `<svg viewBox="0 0 64 64" aria-hidden="true" ${style ? `style="${style}"` : ''}><use href="#g-${name}"/></svg>`;
const hanger = cls => `<svg class="${cls}" viewBox="0 0 64 28" aria-hidden="true"><use href="#g-hanger"/></svg>`;
const tileVars = p => `--bg-t:${p.bg};--fg-t:${p.fg}`;

/* ---------- tema ---------- */
const root = document.documentElement;
$('#theme').addEventListener('click', () => {
  const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
});

/* ---------- componente de seleção (radio em pílulas) ---------- */
function pills(el, options, value, onChange) {
  const draw = v => {
    el.innerHTML = options.map(o =>
      `<button type="button" class="pill" role="radio" aria-checked="${o.value === v}" data-v="${o.value}">${o.label}${o.sub ? `<small>${o.sub}</small>` : ''}</button>`
    ).join('');
  };
  draw(value);
  el.addEventListener('click', e => {
    const b = e.target.closest('.pill'); if (!b) return;
    onChange(b.dataset.v);
  });
  return { set: v => draw(v) };
}
const planOptions = PLANS.map(p => ({ value: p.id, label: p.name, sub: `${p.pieces} peças · ${BRL.format(p.price)}` }));

/* ---------- hero: cabides ---------- */
(() => {
  const rows = [[['tee', '#968700'], ['dress', '#e6e2cf'], ['hoodie', '#6d88ad']], [['pants', '#a35a6d'], ['jacket', '#b8ac6a'], ['skirt', '#8e6fa0']]];
  $('#heroRail').innerHTML = rows.map((row, r) => `<div class="rail">${row.map(([n, c], i) =>
    `<div class="rail-item" style="--i:${r * 3 + i}">${hanger('hk')}<svg class="gm" viewBox="0 0 64 64" style="color:${c}"><use href="#g-${n}"/></svg></div>`
  ).join('')}</div>`).join('');
})();

/* ---------- cartões de plano ---------- */
$('#plans').innerHTML = PLANS.map(p => `
  <article class="tag plan ${p.id === 'premium' ? 'feat' : ''}">
    ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
    <h3>Vesti+ ${p.name}</h3>
    <div class="price num">${BRL.format(p.price)}</div>
    <p class="per">por mês · ≈ ${BRL.format(perPiece(p))} por peça usada</p>
    <ul>
      <li>${p.pieces} peças por semana</li>
      <li>${p.wash ? 'Devolva sem lavar: a lavagem está incluída' : 'Devolução com as peças lavadas'}</li>
      <li>${p.note}</li>
    </ul>
    <button class="btn ${p.id === 'premium' ? '' : 'ghost'}" type="button" data-plan="${p.id}">Experimentar este plano</button>
  </article>`).join('');
$('#plans').addEventListener('click', e => {
  const b = e.target.closest('[data-plan]'); if (!b) return;
  demo.planId = b.dataset.plan; demo.stage = 'pick'; trim(); syncDemo();
  $('#demo').scrollIntoView();
});

/* ---------- demo: sacola ---------- */
const demo = { planId: 'basico', size: 'M', picked: [], stage: 'pick', week: 1, used: 0, paid: 0, cat: 'Tudo', last: null };
const SIZES = ['P', 'M', 'G', 'GG'];
const CATS = ['Tudo', 'Parte de cima', 'Parte de baixo', 'Casacos', 'Vestidos'];

$('#filters').innerHTML = CATS.map(c => `<button type="button" class="chip" aria-pressed="${c === 'Tudo'}" data-c="${c}">${c}</button>`).join('');
$('#catalog').innerHTML = PIECES.map(p => `
  <button type="button" class="piece" data-id="${p.id}" data-cat="${p.cat}" aria-pressed="false" style="${tileVars(p)}">
    <span class="tile">${ico(p.ic)}</span>
    <span><b>${p.name}</b><small>${p.cat}</small></span>
  </button>`).join('');

const demoPlanPills = pills($('#demoPlan'), planOptions, demo.planId, v => { demo.planId = v; trim(); syncDemo(); });
const demoSizePills = pills($('#demoSize'), SIZES.map(s => ({ value: s, label: s })), demo.size, v => { demo.size = v; demoSizePills.set(v); });

function trim() {
  const lim = plan(demo.planId).pieces;
  if (demo.picked.length > lim) demo.picked.length = lim;
}
function setMsg(t, warn) { const m = $('#bagMsg'); m.textContent = t; m.classList.toggle('warn', !!warn); }

function syncDemo() {
  const p = plan(demo.planId), n = demo.picked.length, full = n >= p.pieces;
  $('#viewPick').hidden = demo.stage !== 'pick';
  $('#viewDone').hidden = demo.stage !== 'done';
  demoPlanPills.set(demo.planId);
  $('#weekNo').textContent = demo.week;
  $$('#catalog .piece').forEach(b => {
    const on = demo.picked.includes(b.dataset.id);
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-disabled', !on && full);
    b.hidden = demo.cat !== 'Tudo' && b.dataset.cat !== demo.cat;
  });
  $$('#filters .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.c === demo.cat));
  $('#slots').style.setProperty('--cols', p.pieces === 7 ? 4 : p.pieces);
  $('#slots').innerHTML = Array.from({ length: p.pieces }, (_, i) => {
    const it = piece(demo.picked[i]);
    return it
      ? `<button type="button" class="slot on" data-id="${it.id}" aria-label="Remover ${it.name}" style="${tileVars(it)}">${hanger('hk')}<span class="box">${ico(it.ic)}</span></button>`
      : `<div class="slot">${hanger('hk')}<span class="box"></span></div>`;
  }).join('');
  $('#countTxt').textContent = `${n} de ${p.pieces} peças`;
  $('#perTxt').textContent = `${BRL.format(p.price)}/mês · ${BRL.format(perPiece(p))} por peça`;
  $('#confirm').disabled = n === 0;
  $('#bagChip').textContent = `Ver sacola: ${n}/${p.pieces}`;
  if (!$('#bagMsg').classList.contains('warn') || !full) {
    setMsg(n === 0 ? 'Toque nas peças do catálogo para colocá-las na sacola.'
      : full ? 'Sacola completa. Você já pode fechá-la.' : `Você ainda pode levar mais ${pl(p.pieces - n, 'peça', 'peças')}.`, false);
  }
  if (demo.stage === 'done') drawDone();
}

$('#filters').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  demo.cat = c.dataset.c; syncDemo();
});
$('#catalog').addEventListener('click', e => {
  const b = e.target.closest('.piece'); if (!b) return;
  const id = b.dataset.id, p = plan(demo.planId), i = demo.picked.indexOf(id);
  if (i >= 0) { demo.picked.splice(i, 1); setMsg('', false); }
  else if (demo.picked.length >= p.pieces) { syncDemo(); setMsg(`A sacola do plano ${p.name} comporta ${p.pieces} peças. Remova uma peça para trocar, ou escolha um plano maior.`, true); return; }
  else demo.picked.push(id);
  syncDemo();
});
$('#slots').addEventListener('click', e => {
  const b = e.target.closest('.slot.on'); if (!b) return;
  demo.picked = demo.picked.filter(x => x !== b.dataset.id); setMsg('', false); syncDemo();
});

const fmtDate = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
$('#confirm').addEventListener('click', () => {
  const p = plan(demo.planId);
  if (!demo.picked.length) return;
  demo.used += demo.picked.length;
  if ((demo.week - 1) % 4 === 0) demo.paid += p.price;
  demo.last = { plan: p, size: demo.size, items: demo.picked.slice(), week: demo.week };
  demo.stage = 'done';
  syncDemo();
  $('#demo').scrollIntoView();
});

function drawDone() {
  const L = demo.last; if (!L) return;
  const ret = new Date(); ret.setDate(ret.getDate() + 7);
  $('#ticket').innerHTML = `
    <h3>Sacola da semana ${L.week} confirmada</h3>
    <dl>
      <dt>Plano</dt><dd>Vesti+ ${L.plan.name}</dd>
      <dt>Tamanho</dt><dd>${L.size}</dd>
      <dt>Retirada</dt><dd>Na loja Vesti+, a partir de hoje</dd>
      <dt>Devolução</dt><dd>Até ${fmtDate(ret)}</dd>
    </dl>
    <ul class="tk-items">${L.items.map(id => { const it = piece(id); return `<li style="${tileVars(it)}"><span class="box">${ico(it.ic)}</span>${it.name}</li>`; }).join('')}</ul>
    <p class="wash">${L.plan.wash ? 'No plano Premium você pode devolver as peças sem lavar. A higienização é por nossa conta.' : 'No seu plano, devolva as peças já lavadas. No Premium, a lavagem é por nossa conta.'}</p>`;
  const buy = demo.used * NEW_PRICE, diff = buy - demo.paid;
  $('#cum').innerHTML = `
    <h3>Seu acumulado no Vesti+</h3>
    <dl>
      <div><dt>Peças diferentes usadas</dt><dd class="num">${N0.format(demo.used)}</dd></div>
      <div><dt>Se tivesse comprado tudo novo</dt><dd class="num">${BRL.format(buy)}</dd></div>
      <div><dt>Mensalidades pagas</dt><dd class="num">${BRL.format(demo.paid)}</dd></div>
      <div class="save"><dt>${diff >= 0 ? 'Economia' : 'Diferença'}</dt><dd class="num">${BRL.format(Math.abs(diff))}</dd></div>
    </dl>
    <small>Referência: R$ 120,00 por peça nova (média do projeto). A mensalidade é cobrada a cada 4 semanas.</small>
    <div class="btns">
      <button class="btn" type="button" id="nextWeek">Devolver e escolher a semana ${demo.week + 1}</button>
      <button class="btn ghost" type="button" id="changePlan">Trocar de plano</button>
    </div>`;
}
$('#cum').addEventListener('click', e => {
  if (e.target.id === 'nextWeek') { demo.week++; demo.picked = []; demo.stage = 'pick'; setMsg('', false); syncDemo(); $('#demo').scrollIntoView(); }
  if (e.target.id === 'changePlan') { demo.week++; demo.picked = []; demo.stage = 'pick'; setMsg('Escolha um novo plano e monte a sacola da próxima semana.', false); syncDemo(); $('#bag').scrollIntoView({ block: 'center' }); }
});

/* botão flutuante da sacola (telas pequenas) */
$('#bagChip').addEventListener('click', () => $('#bag').scrollIntoView({ block: 'center' }));
new IntersectionObserver(([en]) => {
  const small = matchMedia('(max-width:980px)').matches;
  $('#chipWrap').classList.toggle('show', small && en.isIntersecting && demo.stage === 'pick');
}, { threshold: 0.05 }).observe($('#viewPick'));

syncDemo();

/* ---------- comprar ou assinar ---------- */
const cmp = { planId: 'basico' };
const cmpPills = pills($('#cmpPlan'), planOptions, cmp.planId, v => { cmp.planId = v; cmpPills.set(v); updateCmp(); });
function updateCmp() {
  const n = +$('#cmpN').value, pr = +$('#cmpP').value, p = plan(cmp.planId);
  $('#cmpNo').textContent = N0.format(n);
  $('#cmpPo').textContent = BRL.format(pr);
  const buy = n * pr, sub = p.price, max = Math.max(buy, sub);
  $('#barBuy').style.width = (buy / max * 100) + '%';
  $('#barVesti').style.width = (sub / max * 100) + '%';
  $('#barBuyV').textContent = BRL.format(buy);
  $('#barVestiL').textContent = `Assinando o Vesti+ ${p.name}`;
  $('#barVestiV').textContent = BRL.format(sub);
  const save = buy - sub;
  $('#verdict').innerHTML = save > 0
    ? `Você economiza <strong>${BRL.format(save)} por mês</strong>, ou ${BRL.format(save * 12)} em um ano.`
    : `Com esse perfil, comprar sai ${BRL.format(-save)} mais barato por mês. O plano ${p.name} passa a compensar a partir de <strong>${pl(Math.ceil(sub / pr), 'peça nova', 'peças novas')} por mês</strong>, e ainda dá acesso a ${N0.format(p.pieces * 4)} peças diferentes.`;
  $('#mfPieces').textContent = N0.format(p.pieces * 4);
  $('#mfWater').textContent = N0.format(n * 12 * WATER) + ' L';
}
$('#cmpN').addEventListener('input', updateCmp);
$('#cmpP').addEventListener('input', updateCmp);
updateCmp();

/* ---------- finanças: tabela ---------- */
(() => {
  const fixo = COSTS.filter(c => c.kind === 'Fixo').reduce((a, c) => a + c.v, 0), vari = COST - fixo;
  $('#costTable tbody').innerHTML = COSTS.map(c => `
    <tr><td>${c.cat}</td><td>${c.item}<div class="share"><span><i style="width:${c.v / COST * 100}%"></i></span>${N0.format(c.v / COST * 100)}%</div></td><td><span class="kind ${c.kind === 'Fixo' ? 'fx' : ''}">${c.kind}</span></td>
    <td class="r">${BRL.format(c.v)}</td></tr>`).join('');
  $('#costTable tfoot').innerHTML = `<tr><td colspan="3">Total por mês</td><td class="r">${BRL.format(COST)}</td></tr>`;
  $('#split').innerHTML = `
    <span class="lbl" style="margin:0">Fixo e variável</span>
    <div class="split-bar" role="img" aria-label="Custos fixos ${N0.format(fixo / COST * 100)}%, variáveis ${N0.format(vari / COST * 100)}%"><i class="a" style="width:${fixo / COST * 100}%"></i><i class="b" style="width:${vari / COST * 100}%"></i></div>
    <p>Fixos: ${BRL.format(fixo)} (${N0.format(fixo / COST * 100)}%) · Variáveis: ${BRL.format(vari)} (${N0.format(vari / COST * 100)}%)</p>`;
})();

/* ---------- finanças: simulador ---------- */
const sim = { planId: 'essencial' };
const simPills = pills($('#simPlan'), planOptions, sim.planId, v => { sim.planId = v; simPills.set(v); updateSim(); });
const niceMax = v => { const p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
const kfmt = v => v === 0 ? 'R$ 0' : 'R$ ' + N1.format(v / 1000) + ' mil';

function drawChart(price, n) {
  const box = $('#chartBox');
  const W = Math.max(280, box.clientWidth || 480), H = Math.round(Math.min(320, Math.max(220, W * 0.52)));
  const m = { l: W < 420 ? 50 : 62, r: 12, t: 14, b: 34 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const ymax = niceMax(Math.max(price * 100, COST) * 1.02);
  const X = v => m.l + v / 100 * iw, Y = v => m.t + ih - v / ymax * ih;
  const be = COST / price, rev = n * price;
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const v = ymax / 4 * i;
    g += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--ink-soft)">${kfmt(v)}</text>`;
  }
  for (let x = 0; x <= 100; x += 25) g += `<text x="${X(x)}" y="${H - 12}" text-anchor="middle" font-size="11" fill="var(--ink-soft)">${x}</text>`;
  g += `<text x="${m.l + iw / 2}" y="${H - 0.5}" text-anchor="middle" font-size="11" fill="var(--ink-soft)">assinantes</text>`;
  g += `<polygon points="${X(0)},${Y(0)} ${X(be)},${Y(COST)} ${X(0)},${Y(COST)}" fill="var(--bad)" opacity=".14"/>`;
  g += `<polygon points="${X(be)},${Y(COST)} ${X(100)},${Y(COST)} ${X(100)},${Y(price * 100)}" fill="var(--accent)" opacity=".18"/>`;
  g += `<line x1="${X(0)}" x2="${X(100)}" y1="${Y(COST)}" y2="${Y(COST)}" stroke="var(--ink-soft)" stroke-width="2" stroke-dasharray="6 5"/>`;
  g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(100)}" y2="${Y(price * 100)}" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>`;
  g += `<line x1="${X(n)}" x2="${X(n)}" y1="${Y(0)}" y2="${Y(Math.max(rev, 0))}" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  g += `<circle cx="${X(n)}" cy="${Y(rev)}" r="6" fill="var(--ink)" stroke="var(--bg)" stroke-width="2"/>`;
  g += `<circle cx="${X(be)}" cy="${Y(COST)}" r="5" fill="var(--bg)" stroke="var(--accent)" stroke-width="3"/>`;
  const beAnchor = be > 70 ? 'end' : 'start', beDx = be > 70 ? -10 : 10;
  g += `<text x="${X(be) + beDx}" y="${Y(COST) - 12}" text-anchor="${beAnchor}" font-size="12" font-weight="700" fill="var(--ink)">Equilíbrio: ${Math.ceil(be - 1e-9)}</text>`;
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Gráfico: receita mensal contra custo mensal de ${BRL.format(COST)}. O ponto de equilíbrio é com ${Math.ceil(be - 1e-9)} assinantes.">${g}</svg>`;
}
function updateSim() {
  const p = plan(sim.planId), n = +$('#simN').value;
  const rev = n * p.price, res = rev - COST, be = Math.ceil(COST / p.price - 1e-9);
  $('#simNo').textContent = N0.format(n);
  $('#stRev').textContent = BRL.format(rev);
  $('#stCost').textContent = BRL.format(COST);
  const r = $('#stRes'); r.textContent = BRL.format(res); r.className = res >= 0 ? 'pos' : 'neg';
  $('#stMar').textContent = rev > 0 ? N0.format(res / rev * 100) + '%' : '—';
  $('#simStatus').textContent = n < be
    ? `Faltam ${pl(be - n, 'assinante', 'assinantes')} para cobrir os ${BRL.format(COST)} de custo.`
    : n === be ? 'Ponto de equilíbrio atingido: o negócio se paga, sem lucro.' : `Acima do equilíbrio, com ${pl(n - be, 'assinante', 'assinantes')} além do necessário.`;
  $('#formula').innerHTML = `Ponto de equilíbrio = custo mensal ÷ mensalidade<br><b>${BRL.format(COST)} ÷ ${BRL.format(p.price)} = ${N1.format(COST / p.price)} → ${be} assinantes</b>`;
  $('#payback').innerHTML = res > 0
    ? `Com esse resultado, o investimento inicial se paga em <b>${N1.format(INVEST[0] / res)} a ${N1.format(INVEST[1] / res)} meses</b> (estimativa simples, sem impostos e sem reposição de peças).`
    : 'Sem lucro no mês, o investimento inicial ainda não é recuperado.';
  drawChart(p.price, n);
}
$('#simN').addEventListener('input', updateSim);
updateSim();
let rz; new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(updateSim); }).observe($('#chartBox'));

/* ---------- moeda fictícia (guarda no navegador deste computador) ---------- */
const KEY = 'vestimais:moedas';
let coins = 0;
try { coins = parseInt(localStorage.getItem(KEY) || '0', 10) || 0; } catch (e) {}
const saveCoins = () => { try { localStorage.setItem(KEY, String(coins)); } catch (e) {} };
const showCoins = () => { $('#coinCount').textContent = N0.format(coins); };
showCoins();
$('#invest').addEventListener('click', () => {
  coins++; saveCoins(); showCoins();
  const c = $('#coin'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
});
let armed = false, armT;
$('#coinReset').addEventListener('click', e => {
  const b = e.currentTarget;
  if (!armed) { armed = true; b.textContent = 'Clique de novo para zerar'; armT = setTimeout(() => { armed = false; b.textContent = 'Zerar contador'; }, 3000); return; }
  clearTimeout(armT); armed = false; coins = 0; saveCoins(); showCoins(); b.textContent = 'Zerar contador';
});
})();
