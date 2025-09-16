
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "Arial", "sans-serif"]
            },
            colors: {
                brand: {
                    50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
                    500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63'
                }
            },
            boxShadow: {
                soft: '0 10px 30px -12px rgba(0,0,0,0.25)',
                glow: '0 0 0 1px rgba(34,211,238,.2), 0 8px 30px -8px rgba(34,211,238,.45)'
            },
            keyframes: {
                fadeZoom: { '0%': { opacity: 0, transform: 'scale(.96) translateY(10px)' }, '100%': { opacity: 1, transform: 'scale(1) translateY(0)' } },
                floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
                pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(34,211,238,.2)' }, '50%': { boxShadow: '0 0 0 8px rgba(34,211,238,.08)' } },
                gradientMove: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '100% 50%' } },
                blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } }
            },
            animation: {
                fadeZoom: 'fadeZoom .8s ease-out',
                floaty: 'floaty 6s ease-in-out infinite',
                pulseGlow: 'pulseGlow 3s ease-in-out infinite',
                gradientMove: 'gradientMove 12s linear infinite',
                blink: 'blink 1s step-end infinite'
            }
        }
    }
}


document.getElementById('year').textContent = new Date().getFullYear();


const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));


const bar = document.getElementById('scrollbar');
const onScrollBar = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100) + '%';
}
window.addEventListener('scroll', onScrollBar, { passive: true });
onScrollBar();


const avail = document.getElementById('availabilityBadge');
const onScrollAvail = () => {
    const max = 140;
    const y = Math.min(window.scrollY, max);
    const t = y / max;
    const scale = 1 + t * 0.06;
    const opacity = 1 - t;
    if (avail) { avail.style.transform = `scale(${scale})`; avail.style.opacity = opacity.toFixed(3); }
};
window.addEventListener('scroll', onScrollAvail, { passive: true });


const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
document.querySelectorAll('.will-reveal').forEach(el => io.observe(el));


const tilt = document.querySelector('.tilt');
if (tilt) {
    tilt.addEventListener('mousemove', (e) => {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - .5) * -8;
        const ry = (x - .5) * 8;
        tilt.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tilt.addEventListener('mouseleave', () => { tilt.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; });
}


const parallax = document.querySelector('.parallax-tiles');
if (parallax) {
    const tiles = parallax.querySelectorAll('.tile');
    let raf = null;
    let targetX = 0, targetY = 0;
    const update = () => {
        tiles.forEach(t => {
            const d = parseFloat(t.dataset.depth || '0.03');
            const tx = -targetX * d;
            const ty = -targetY * d;
            t.style.transform = `translate(${tx}px, ${ty}px)`;
        });
        raf = null;
    };
    parallax.addEventListener('mousemove', (e) => {
        const r = parallax.getBoundingClientRect();
        targetX = (e.clientX - (r.left + r.width / 2));
        targetY = (e.clientY - (r.top + r.height / 2));
        if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    parallax.addEventListener('mouseleave', () => { targetX = targetY = 0; update(); });
}


const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
}, { passive: true });


(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.getElementById('typingText');
    const caret = document.getElementById('typingCaret');
    if (!el || !caret) return;

    const text = 'Full-Stack Web Developer';
    const speed = 35;
    const pauseEnd = 250;

    const afterTypingReveal = () => {
        document.querySelectorAll('#inicio .will-reveal').forEach((n, i) => {
            n.style.transitionDelay = `${0.05 * i}s`;
            n.classList.add('is-visible');
        });
    };

    if (prefersReduced) {
        el.textContent = text;
        caret.style.display = 'none';
        afterTypingReveal();
        return;
    }

    el.textContent = '';
    let i = 0;
    const tick = () => {
        el.textContent = text.slice(0, i++);
        if (i <= text.length) {
            setTimeout(tick, speed);
        } else {
            setTimeout(() => {
                caret.style.display = 'none';
                afterTypingReveal();
            }, pauseEnd);
        }
    };
    tick();
})();