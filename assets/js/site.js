(function () {
	'use strict';

	// Mobile menu
	var btn = document.getElementById('menuBtn');
	var nav = document.getElementById('nav');
	if (btn && nav) {
		btn.addEventListener('click', function () {
			var open = nav.classList.toggle('open');
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
			btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		});
		nav.addEventListener('click', function (e) {
			if (e.target.tagName === 'A') {
				nav.classList.remove('open');
				btn.setAttribute('aria-expanded', 'false');
			}
		});
	}

	// Play videos only while visible (saves data and battery)
	var videos = document.querySelectorAll('video[data-autoplay]');
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) {
		videos.forEach(function (v) { v.controls = true; });
	} else if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				var v = en.target;
				if (en.isIntersecting) {
					var p = v.play();
					if (p && p.catch) { p.catch(function () {}); }
				} else {
					v.pause();
				}
			});
		}, { threshold: 0.35 });
		videos.forEach(function (v) { io.observe(v); });
	} else {
		videos.forEach(function (v) { v.autoplay = true; });
	}

	// Copy NayaPay number
	var toast = document.getElementById('toast');
	var timer;
	function say(msg) {
		if (!toast) { return; }
		toast.textContent = msg;
		toast.classList.add('show');
		clearTimeout(timer);
		timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
	}
	document.querySelectorAll('.copy').forEach(function (b) {
		b.addEventListener('click', function () {
			var text = b.getAttribute('data-copy');
			function fallback() {
				var t = document.createElement('textarea');
				t.value = text; t.setAttribute('readonly', '');
				t.style.position = 'fixed'; t.style.opacity = '0';
				document.body.appendChild(t); t.select();
				try { document.execCommand('copy'); say('NayaPay number copied'); }
				catch (err) { say('Number: ' + text); }
				document.body.removeChild(t);
			}
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(function () { say('NayaPay number copied'); }, fallback);
			} else { fallback(); }
		});
	});

	var y = document.getElementById('year');
	if (y) { y.textContent = new Date().getFullYear(); }
})();
