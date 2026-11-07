// Mobile nav toggle + transparent-to-solid navbar on scroll
document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  var nav = document.getElementById('nav') || document.querySelector('.navbar');
  if (nav) {
    // Interior pages have a solid banner, so keep the nav solid there from the start.
    var overHero = !!document.querySelector('.hero-full');
    var apply = function () {
      if (!overHero || window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  }

  document.querySelectorAll('form[data-form]').forEach(wireForm);
});

// Forms are emailed by our site-forms Cloudflare worker (Resend). The worker holds the
// recipient address, so the page only names the site. Replaced FormSubmit in Nov 2026.
var FORM_ENDPOINT = 'https://site-forms.alfanoministries.workers.dev/rivermin';

function wireForm(form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type=submit]');
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (data._honey) return; // a bot filled the hidden field
    delete data._honey;
    data._subject = 'Website message: ' + (data.subject || 'River Ministries');
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending...';
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (String(res.success) !== 'true') throw new Error(res.message || 'failed');
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Thank you! We got your message and will be in touch soon.';
    }).catch(function () {
      status.className = 'form-status err';
      status.textContent = 'Sorry, that did not go through. Please try again in a minute.';
    }).then(function () { button.disabled = false; });
  });
}
