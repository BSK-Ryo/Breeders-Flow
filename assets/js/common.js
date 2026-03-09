// Mobile Menu Toggle
(function() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var iconMenu = document.getElementById('icon-menu');
    var iconClose = document.getElementById('icon-close');
    var mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        iconMenu.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', toggleMenu);
    });
})();

// Mobile Services Sub-menu Toggle
(function() {
    var servicesBtn = document.getElementById('mobile-services-toggle');
    var servicesPanel = document.getElementById('mobile-services-panel');
    if (servicesBtn && servicesPanel) {
        servicesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            servicesPanel.classList.toggle('hidden');
            var chevron = servicesBtn.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = servicesPanel.classList.contains('hidden') ? '' : 'rotate(180deg)';
            }
        });
    }
})();

// Fade-in animation via Intersection Observer
(function() {
    var fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length > 0) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        fadeEls.forEach(function(el) { observer.observe(el); });
    }
})();

// Contact form: show success message after redirect
(function() {
    if (window.location.search.indexOf('sent=true') !== -1) {
        var form = document.getElementById('contact-form');
        var msg = document.getElementById('sent-message');
        if (form && msg) {
            form.style.display = 'none';
            msg.classList.remove('hidden');
        }
    }
})();

// Navbar scroll shadow
(function() {
    var navbar = document.querySelector('header');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-lg');
                navbar.classList.remove('shadow-sm');
            } else {
                navbar.classList.remove('shadow-lg');
                navbar.classList.add('shadow-sm');
            }
        });
    }
})();
