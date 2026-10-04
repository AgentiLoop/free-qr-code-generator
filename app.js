// Free QR Code Generator — everything runs in the browser, no network requests.
(function () {
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const $ = (id) => document.getElementById(id);
  const v = (id) => { const el = $('f_' + id); return el.type === 'checkbox' ? el.checked : el.value.trim(); };
  const esc = (s) => String(s).replace(/([\\;,:"])/g, '\\$1');
  const vesc = (s) => String(s).replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');
  const https = (s) => (!s ? '' : /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : 'https://' + s);
  const phone = (s) => s.replace(/[^\d+]/g, '');

  const build = {
    url: () => https(v('url')),
    text: () => v('text'),
    wifi: () => {
      const enc = v('enc');
      return `WIFI:T:${enc};S:${esc(v('ssid'))};${enc === 'nopass' ? '' : 'P:' + esc(v('pass')) + ';'}${v('hidden') ? 'H:true;' : ''};`;
    },
    vcard: () => {
      const first = v('first'), last = v('last');
      const L = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vesc(last)};${vesc(first)};;;`, `FN:${vesc((first + ' ' + last).trim())}`];
      if (v('org')) L.push('ORG:' + vesc(v('org')));
      if (v('phone')) L.push('TEL;TYPE=CELL:' + v('phone'));
      if (v('vemail')) L.push('EMAIL:' + v('vemail'));
      if (v('website')) L.push('URL:' + https(v('website')));
      L.push('END:VCARD');
      return L.join('\n');
    },
    email: () => {
      const q = [];
      if (v('subject')) q.push('subject=' + encodeURIComponent(v('subject')));
      if (v('body')) q.push('body=' + encodeURIComponent(v('body')));
      return 'mailto:' + v('to') + (q.length ? '?' + q.join('&') : '');
    },
    sms: () => `SMSTO:${phone(v('smsphone'))}:${v('message')}`,
    tel: () => 'tel:' + phone(v('tel')),
  };

  let kind = 'url';
  const payload = () => build[kind]() || ' ';
  const opts = () => ({ fg: $('f_fg').value, bg: $('f_bg').value, ec: $('f_ec').value });

  function make(text, ec) {
    const q = qrcode(0, ec);
    q.addData(text, /^[0-9A-Z $%*+\-./:]*$/.test(text) ? 'Alphanumeric' : 'Byte');
    q.make();
    return q;
  }

  function draw(canvas, text, o, scale) {
    const q = make(text, o.ec), n = q.getModuleCount(), m = 4, size = (n + m * 2) * scale;
    canvas.width = canvas.height = size;
    const c = canvas.getContext('2d');
    c.fillStyle = o.bg; c.fillRect(0, 0, size, size);
    c.fillStyle = o.fg;
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++)
      if (q.isDark(r, k)) c.fillRect((k + m) * scale, (r + m) * scale, scale, scale);
    return q;
  }

  function svg(text, o) {
    const q = make(text, o.ec), n = q.getModuleCount(), m = 4, s = n + m * 2;
    let d = '';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++)
      if (q.isDark(r, k)) d += `M${k + m} ${r + m}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges"><rect width="${s}" height="${s}" fill="${o.bg}"/><path d="${d}" fill="${o.fg}"/></svg>`;
  }

  function save(name, href) {
    const a = document.createElement('a');
    a.href = href; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }

  function render() {
    try {
      const q = draw($('pv'), payload(), opts(), 10);
      $('info').textContent = `Version ${(q.getModuleCount() - 17) / 4} · ${q.getModuleCount()}×${q.getModuleCount()} modules · ${payload().length} characters`;
    } catch (e) {
      $('info').textContent = 'Too much data for one QR code — shorten the text or lower error correction.';
    }
  }

  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => {
    kind = b.dataset.kind;
    document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('fieldset[data-for]').forEach((f) => { f.hidden = f.dataset.for !== kind; });
    render();
  }));
  document.querySelectorAll('#gen input, #gen select, #gen textarea').forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  $('dlPng').onclick = () => {
    const cv = document.createElement('canvas');
    draw(cv, payload(), opts(), 24);
    save(kind + '-qr-code.png', cv.toDataURL('image/png'));
  };
  $('dlSvg').onclick = () => {
    const url = URL.createObjectURL(new Blob([svg(payload(), opts())], { type: 'image/svg+xml' }));
    save(kind + '-qr-code.svg', url);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  window.FreeQR = { build, payload, svg, setKind: (k) => document.querySelector(`.tabs button[data-kind="${k}"]`).click() };
  render();
})();
