(function () {
  'use strict';
  if (window.felicitasAnalytics) return;
  var measurementId = 'G-G76GFDSWE5';
  var preferenceKey = 'felicitas.analytics.disabled';
  var disabled = false;
  var started = false;
  var domains = ['feclicitasamulets.com', 'www.feclicitasamulets.com'];
  var productionPage = domains.indexOf(location.hostname) !== -1 && location.pathname === '/';
  function savedPreference() {
    try { return localStorage.getItem(preferenceKey) === 'true'; } catch (_) { return false; }
  }
  function privacySignal() {
    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || navigator.globalPrivacyControl === true;
  }
  function blocked() { return disabled || savedPreference() || privacySignal() || !productionPage; }
  function referrerOrigin() {
    try { return new URL(document.referrer).origin + '/'; } catch (_) { return ''; }
  }
  function loadScript(src) {
    var script = document.createElement('script');
    script.src = src; script.defer = true;
    document.head.appendChild(script);
  }
  function start() {
    if (started || blocked()) return;
    started = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { if (!blocked()) window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      page_location: 'https://feclicitasamulets.com/',
      page_referrer: referrerOrigin(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    window.gtag('event', 'page_view', {
      page_location: 'https://feclicitasamulets.com/',
      page_referrer: referrerOrigin(),
      page_title: document.title
    });
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + measurementId);
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.va('beforeSend', function (event) {
      if (blocked()) return null;
      // One canonical page; do not record visitor-supplied query strings or fragments.
      return Object.assign({}, event, { url: 'https://feclicitasamulets.com/' });
    });
    loadScript('/_vercel/insights/script.js');
  }
  function track(name, interest) {
    if (blocked() || !started) return;
    if (['sign_up', 'generate_lead', 'view_book', 'launch_interest'].indexOf(name) === -1) return;
    var allowed = ['all', 'mystery-box', 'collection', 'book', 'contact'];
    window.gtag('event', name, {
      product_interest: allowed.indexOf(interest) !== -1 ? interest : 'all',
      page_location: 'https://feclicitasamulets.com/',
      page_referrer: referrerOrigin()
    });
  }
  function refreshPreference() {
    var button = document.getElementById('analyticsPreference');
    var status = document.getElementById('analyticsStatus');
    if (!button || !status) return;
    var paused = disabled || savedPreference();
    button.textContent = paused ? 'Resume analytics on this browser' : 'Pause analytics on this browser';
    button.disabled = privacySignal();
    status.textContent = privacySignal() ? 'Paused by your browser privacy setting.' : paused ? 'Analytics paused.' : 'Analytics enabled.';
  }
  window.felicitasAnalytics = { track: track };
  function init() {
    start(); refreshPreference();
    var button = document.getElementById('analyticsPreference');
    if (button) button.addEventListener('click', function () {
      disabled = !(disabled || savedPreference());
      try { localStorage.setItem(preferenceKey, String(disabled)); } catch (_) {}
      window['ga-disable-' + measurementId] = disabled || privacySignal();
      if (!disabled) start();
      refreshPreference();
    });
    document.querySelectorAll('a[data-interest]').forEach(function (link) {
      link.addEventListener('click', function () { track('launch_interest', link.getAttribute('data-interest')); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
