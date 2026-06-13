// Mini "Katalog" als JSON (Demo). Später durch CMS/API ersetzen.
const PRODUCTS = [
  {
    id: "lasse-hose",
    name: "Mitwachshose »Lasse«",
    category: "Hosen",
    price: 34.00,
    colors: ["braun-weiß","blau","beige"],   // passe an, was du anbietest
    sizes: ["44","50","56","62","68","74","80","86","92","98","104","110","116","122"],
    images: ["assets/img/lasse-1.jpg","assets/img/lasse-2.jpg"],
    desc: "Bequeme Mitwachshose mit weichen Bündchen an Bauch & Beinen. Auf Wunsch in weiteren Stoffen erhältlich."
  }
  // weitere Demo-Produkte kannst du hier später ergänzen
];


const PRODUCTS = [
  {
    id: "lasse-hose",
    name: "Mitwachshose »Lasse«",
    category: "Hosen",
    price: 34.00,
    colors: ["braun-weiß","blau","beige"],   // passe an, was du anbietest
    sizes: ["44","50","56","62","68","74","80","86","92","98","104","110","116","122"],
    images: ["assets/img/lasse-1.jpg","assets/img/lasse-2.jpg"],
    desc: "Bequeme Mitwachshose mit weichen Bündchen an Bauch & Beinen. Auf Wunsch in weiteren Stoffen erhältlich."
  },
  {
    id: "linen-shirt",
    name: "Leinenhemd ‚Clair‘",
    category: "Oberteile",
    price: 79.00,
    colors: ["beige","weiß","blau"],
    sizes: ["XS","S","M","L","XL"],
    images: ["assets/img/linen-shirt-1.jpg","assets/img/linen-shirt-2.jpg"],
    desc: "Leichtes Leinenhemd mit Perlmuttknöpfen. Locker geschnitten, atmungsaktiv."
  },
  {
    id: "midi-dress",
    name: "Midi‑Kleid ‚Lune‘",
    category: "Kleider",
    price: 119.00,
    colors: ["beige","schwarz","rot"],
    sizes: ["XS","S","M","L"],
    images: ["assets/img/midi-dress-1.jpg","assets/img/midi-dress-2.jpg"],
    desc: "Fließendes Kleid mit dezentem Rückenausschnitt. Handgenäht aus Viskose."
  },
  {
    id: "wide-pants",
    name: "Weite Hose ‚Nora‘",
    category: "Hosen",
    price: 89.00,
    colors: ["schwarz","beige"],
    sizes: ["S","M","L","XL"],
    images: ["assets/img/wide-pants-1.jpg","assets/img/wide-pants-2.jpg"],
    desc: "Weite Silhouette, hoher Bund, weich fallender Stoff – superbequem."
  },
  {
    id: "wool-scarf",
    name: "Wollschal ‚Étoile‘",
    category: "Accessoires",
    price: 49.00,
    colors: ["blau","weiß","beige"],
    sizes: ["Onesize"],
    images: ["assets/img/wool-scarf-1.jpg"],
    desc: "Warmer, weicher Schal aus Merinowolle, unisex."
  }
];

// Utils
const € = n => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n);
const qs = (s,el=document)=>el.querySelector(s);
const qsa = (s,el=document)=>[...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);

function renderCard(p){
  return `
    <article class="card">
      <a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
        <img src="${p.images[0] || 'assets/img/placeholder.jpg'}" alt="${p.name}">
      </a>
      <h3><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
      <p class="price">${€(p.price)}</p>
    </article>
  `;
}

function renderGrid(listEl, items){
  listEl.innerHTML = items.map(renderCard).join('');
}

// Home: New arrivals (erste 4)
(function homeInit(){
  const el = qs('#new-arrivals');
  if(!el) return;
  renderGrid(el, PRODUCTS.slice(0,4));
})();

// Products page: Filter + Liste
(function productsInit(){
  const list = qs('#product-list');
  if(!list) return;

  const form = qs('#filters');
  function apply(){
    const f = Object.fromEntries(new FormData(form).entries());
    const q = (f.q||'').toLowerCase();
    const items = PRODUCTS.filter(p=>{
      const byCat = !f.category || p.category===f.category;
      const byColor = !f.color || p.colors.includes(f.color);
      const bySize = !f.size || p.sizes.includes(f.size);
      const byQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return byCat && byColor && bySize && byQ;
    });
    renderGrid(list, items);
  }
  form.addEventListener('input', apply);
  apply();
})();

// Product page: Details
(function productPageInit(){
  const id = params.get('id');
  if(!id) return;
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ location.href = 'products.html'; return; }

  document.title = `${p.name} – lilleluneatelier`;
  qs('#prod-name').textContent = p.name;
  qs('#prod-price').textContent = €(p.price);
  qs('#prod-desc').textContent = p.desc;

  const img = qs('#prod-image');
  img.src = p.images[0] || 'assets/img/placeholder.jpg';
  img.alt = p.name;

  const thumbs = qs('#thumbs');
  thumbs.innerHTML = (p.images||[]).map(src=>`<img src="${src}" alt="${p.name}">`).join('');
  thumbs.addEventListener('click', e=>{
    if(e.target.tagName==='IMG'){ img.src = e.target.src; }
  });

  const cSel = qs('#opt-color'); const sSel = qs('#opt-size');
  cSel.innerHTML = p.colors.map(c=>`<option>${c}</option>`).join('');
  sSel.innerHTML = p.sizes.map(s=>`<option>${s}</option>`).join('');

  // Demo-"Kaufen": öffnet Mail mit Vorauswahl
  const buy = qs('#buy-btn');
  const subject = encodeURIComponent(`Anfrage: ${p.name}`);
  function mailto(){
    const color = encodeURIComponent(cSel.value||'');
    const size = encodeURIComponent(sSel.value||'');
    const body = encodeURIComponent(`Hallo lilleluneatelier,\nich interessiere mich für:\n\nProdukt: ${p.name}\nFarbe: ${cSel.value}\nGröße: ${sSel.value}\nPreis: ${€(p.price)}\n\nBitte um Rückmeldung.\n`);
    return `mailto:info@lilleluneatelier.example?subject=${subject}&body=${body}`;
  }
  buy.setAttribute('href', mailto());
  cSel.addEventListener('change', ()=> buy.setAttribute('href', mailto()));
  sSel.addEventListener('change', ()=> buy.setAttribute('href', mailto()));
})();

// Contact: mailto senden
(function contactInit(){
  const form = qs('#contact-form');
  if(!form) return;
  const msg = qs('#form-msg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const subject = encodeURIComponent(`Nachricht von ${d.name}`);
    const body = encodeURIComponent(`${d.message}\n\n— ${d.name}\n${d.email}`);
    location.href = `mailto:info@lilleluneatelier.example?subject=${subject}&body=${body}`;
    msg.textContent = "E-Mail-Client wurde geöffnet. Falls nichts passiert: Schreibe uns direkt an.";
  });
})();

// Footer Jahr
(function year(){ const y = qs('#year'); if(y) y.textContent = new Date().getFullYear(); })();
