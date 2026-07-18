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
});
