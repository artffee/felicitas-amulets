const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require('node:path').join(__dirname, '../analytics.js'), 'utf8');

function browser(options = {}) {
  const scripts = [], handlers = {}, values = new Map();
  if (options.disabled) values.set('felicitas.analytics.disabled', 'true');
  const button = { addEventListener: (name, fn) => handlers[name] = fn };
  const status = {};
  const win = {};
  const context = {
    window: win, URL, Date,
    navigator: options.navigator || {},
    location: { hostname: options.hostname || 'feclicitasamulets.com', pathname: options.path || '/' },
    localStorage: { getItem: k => values.get(k), setItem: (k, v) => values.set(k, v) },
    document: {
      title: 'Felicitas Amulets', readyState: 'complete',
      referrer: 'https://example.com/private?email=person@example.com#secret',
      createElement: () => ({}), head: { appendChild: s => scripts.push(s) },
      getElementById: id => id === 'analyticsPreference' ? button : status,
      querySelectorAll: () => []
    }
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return { win, context, scripts, handlers, button, status };
}

test('production initializes each provider once and exactly one Google page view', () => {
  const b = browser();
  vm.runInContext(code, b.context);
  assert.equal(b.scripts.length, 2);
  assert.equal(b.scripts[1].src, '/_vercel/insights/script.js');
  const config = b.win.dataLayer.find(a => a[0] === 'config')[2];
  assert.equal(config.send_page_view, false);
  const views = b.win.dataLayer.filter(a => a[1] === 'page_view');
  assert.equal(views.length, 1);
  assert.equal(views[0][2].page_referrer, 'https://example.com/');
  assert.equal(views[0][2].page_location, 'https://feclicitasamulets.com/');
});

test('preview, draft pages and privacy signals do not load providers', () => {
  for (const options of [
    { hostname: 'localhost' }, { hostname: 'medalion-preview.vercel.app' },
    { path: '/design-cabinet.html' }, { path: '/index.html' },
    { navigator: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } },
    { disabled: true }
  ]) {
    const b = browser(options);
    b.win.felicitasAnalytics.track('sign_up', 'book');
    assert.equal(b.scripts.length, 0, JSON.stringify(options));
    assert.equal(b.win.dataLayer, undefined);
  }
});

test('Vercel URLs are canonical and query/fragment data never survives', () => {
  const b = browser();
  const beforeSend = b.win.vaq.find(a => a[0] === 'beforeSend')[1];
  assert.equal(beforeSend({ type: 'pageview', url: 'https://feclicitasamulets.com/?email=secret#token' }).url, 'https://feclicitasamulets.com/');
  b.handlers.click();
  assert.equal(beforeSend({ url: 'https://feclicitasamulets.com/' }), null);
  assert.equal(b.win['ga-disable-G-G76GFDSWE5'], true);
});

test('pause and resume control events without double counting', () => {
  const b = browser();
  const initial = b.win.dataLayer.length;
  b.handlers.click();
  b.win.felicitasAnalytics.track('sign_up', 'book');
  assert.equal(b.win.dataLayer.length, initial);
  b.handlers.click();
  b.win.felicitasAnalytics.track('sign_up', 'book');
  assert.equal(b.win.dataLayer.length, initial + 1);
  assert.equal(b.scripts.length, 2);
  assert.equal(b.win['ga-disable-G-G76GFDSWE5'], false);
});

test('only approved events and categorical values are sent', () => {
  const b = browser();
  const initial = b.win.dataLayer.length;
  b.win.felicitasAnalytics.track('private-message', 'person@example.com');
  assert.equal(b.win.dataLayer.length, initial);
  b.win.felicitasAnalytics.track('sign_up', 'person@example.com');
  const args = b.win.dataLayer.at(-1);
  assert.equal(args[2].product_interest, 'all');
  assert.equal(JSON.stringify(b.win.dataLayer).includes('person@example.com'), false);
});

test('blocked storage does not stop the page or local pause control', () => {
  const b = browser();
  b.context.localStorage = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } };
  b.handlers.click();
  assert.equal(b.win['ga-disable-G-G76GFDSWE5'], true);
  b.handlers.click();
  assert.equal(b.win['ga-disable-G-G76GFDSWE5'], false);
});
