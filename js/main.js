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

// The contact form is emailed through FormSubmit (formsubmit.co). The first message
// sent to a new address triggers a one-time "activate" email that must be clicked.
var RM_FORM_EMAIL = 'giltowers@gmail.com';

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
    data._template = 'table';
    data._captcha = 'false';
    if (data.email) data._replyto = data.email;
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending...';
    fetch('https://formsubmit.co/ajax/' + RM_FORM_EMAIL, {
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
