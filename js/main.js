// --- Load YAML (returns array) ---
async function loadItemsFromYaml(url = 'items.yml') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const text = await res.text();
    const data = jsyaml.load(text);
    const items = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
    if (!Array.isArray(items)) throw new Error('Parsed YAML is not an array');
    window.items = items;
    return items;
  }
  
  // --- Render items into #itemsContainer ---
  function generateItems() {
    const container = document.getElementById('itemsContainer');
    if (!container || !Array.isArray(window.items)) return;
    container.innerHTML = ''; // reset
  
    window.items.forEach((item = {}, i) => {
      const img = escapeHtml(item.image || '');
      const title = escapeHtml(item.title || '');
      const subtitle = escapeHtml(item.subtitle || '');
      const link = escapeAttr(item.link || '#');
      const itemHtml = `
        <div class="item">
          <div class="item-inner">
            <div class="row1"><img src="${img}" alt="${title} logo" class="img"></div>
            <div class="row2">
              <p class="title">${title}</p>
              <p class="subtitle" id="subtitle-${i}">${subtitle}</p>
            </div>
            <div class="row3">
              <div class="buttons">
                <a href="${link}" class="button" target="_blank" rel="noopener"><img src="img/material-open.svg"></a>
                <div class="status"><span class="dot" id="status-${i}"></span></div>
                <a class="button copy-button" data-sub="${escapeAttr(item.subtitle || '')}" href="#"><img src="img/material-copy.svg"></a>
              </div>
            </div>
          </div>
        </div>`;
      container.insertAdjacentHTML('beforeend', itemHtml);
    });
  
    // event delegation for copy buttons
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-button');
      if (!btn) return;
      e.preventDefault();
      copyToClipboard(btn.dataset.sub || '');
    });
  }
  
  // --- Ping each item's pingUrl and update dot ---
  function pingUrls() {
    if (!Array.isArray(window.items)) return;
    window.items.forEach((it, i) => pingUrl(it.pingUrl, `status-${i}`));
  }
  
  async function pingUrl(url, statusId) {
    const el = document.getElementById(statusId);
    if (!el || !url) return;
    el.classList.add('fade-in-out');
    try {
      // no-cors may return opaque; treat opaque as up
      const res = await fetch(url, { method: 'GET', mode: 'no-cors' });
      const ok = res && (res.ok || res.type === 'opaque');
      el.classList.toggle('up', ok);
      el.classList.toggle('down', !ok);
      console.log(`Ping ${url}:`, (res && res.status) || res.type || 'no response');
    } catch (e) {
      console.error('Ping error', e);
      el.classList.add('down');
      el.classList.remove('up');
    } finally {
      el.classList.remove('fade-in-out');
    }
  }
  
  // --- Copy helper with fallback + notification ---
  function copyToClipboard(text = '') {
    const val = String(text);
    const done = () => {
      const n = document.getElementById('notification');
      if (!n) return;
      n.style.height = '50px';
      setTimeout(() => { n.style.height = '0'; }, 3000);
    };
  
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(val).then(done).catch(() => fallback());
    } else fallback();
  
    function fallback() {
      const input = document.createElement('textarea');
      input.value = val;
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      try { document.execCommand('copy'); done(); } catch (e) { console.error('Fallback copy failed', e); }
      input.remove();
    }
  }
  
  // --- Fetch IP and location (minimal, graceful) ---
  async function fetchIpAndLocation() {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
      const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const { city = '' } = await locRes.json();
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('ipAddress', ip || '');
      set('location', city);
      const div = document.getElementById('divider'); if (div) div.textContent = ip ? '|' : '';
      const footer = document.getElementById('footerContent'); if (footer) footer.classList.add('fade-in');
    } catch (e) {
      console.error('IP/location fetch error', e);
    }
  }
  
  // --- Simple escaping ---
  function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s = '') { return escapeHtml(s).replace(/"/g, '&quot;'); }
  
  // --- Init ---
  (async () => {
    try {
      await loadItemsFromYaml('items.yml');
      generateItems();
      pingUrls();
      fetchIpAndLocation();
      setInterval(pingUrls, 60_000);
    } catch (err) {
      console.error('Init error:', err);
    }
  })();