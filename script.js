// GSAP Scroll-based animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
        }
    });
});

// HERO SECTION - Zaawansowane animacje
// Glitch effect on title
const glitchText = document.querySelector('.glitch-text');
const subtitle = document.querySelector('.subtitle');

if (glitchText) {
    // Initial animation on load
    gsap.from(glitchText, {
        opacity: 0,
        duration: 2,
        ease: "power3.out"
    });

    // Random glitch effect
    gsap.to(glitchText, {
        duration: 0.1,
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
        stagger: 2, // Animate every 2 seconds
        onRepeat: () => {
            glitchText.style.setProperty('--clip-1', `${Math.random() * 100}% 0 ${Math.random() * 100}% 0`);
            glitchText.style.setProperty('--clip-2', `${Math.random() * 100}% 0 ${Math.random() * 100}% 0`);
            gsap.fromTo(glitchText.style, {
                clipPath: `inset(0 0 100% 0)`
            }, {
                clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
                duration: 0.1,
                ease: "power1.inOut"
            });
        }
    });

    // Mousemove parallax effect
    document.addEventListener('mousemove', function(e) {
        const rect = glitchText.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        gsap.to(glitchText, {
            x: (x * 30 - 15),
            y: (y * 30 - 15),
            duration: 0.5,
            ease: "power2.out"
        });
    });
}

// ABOUT SECTION - Parallax na tekście
const aboutText = document.querySelector('.about-text');
if (aboutText) {
    gsap.from(aboutText, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: aboutText,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
        }
    });
}

// PROJECTS SECTION - Zaawansowane animacje kart
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    gsap.from(card, {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        rotationY: 90,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
        }
    });
});

// Booklly link animation
const bookllyLink = document.querySelector('.project-link');
if (bookllyLink) {
    const text = bookllyLink.textContent;
    bookllyLink.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        bookllyLink.appendChild(span);
    });

    const neonSpans = bookllyLink.querySelectorAll('span');
    bookllyLink.addEventListener('mouseenter', () => {
        gsap.to(neonSpans, {
            y: -5,
            rotation: 'random(-5, 5)',
            stagger: 0.05,
            duration: 0.2,
            ease: "power1.inOut",
            color: '#000000'
        });
    });
    bookllyLink.addEventListener('mouseleave', () => {
        gsap.to(neonSpans, {
            y: 0,
            rotation: 0,
            stagger: 0.05,
            duration: 0.2,
            ease: "power1.inOut",
            color: '#ff00ff'
        });
    });
}

// CONTACT FORM - Animacja przycisku wysyłania
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
    gsap.to(submitBtn, {
        y: -5,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "power1.inOut",
        scale: 1.05,
        border: '2px solid #00ffff'
    });
}

// ANIMATED BACKGROUND CANVAS (CYBER GRID)
const canvas = document.getElementById('background-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const gridSize = 50;
    const points = [];

    for (let y = 0; y < canvas.height / gridSize; y++) {
        for (let x = 0; x < canvas.width / gridSize; x++) {
            points.push({
                x: x * gridSize + Math.random() * 20 - 10,
                y: y * gridSize + Math.random() * 20 - 10,
                opacity: Math.random() * 0.5 + 0.1,
                speed: Math.random() * 0.02 + 0.01,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(p => {
            p.opacity += p.speed * p.direction;
            if (p.opacity > 0.7 || p.opacity < 0.1) {
                p.direction *= -1;
            }
            ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
            ctx.fillRect(p.x, p.y, 2, 2);
        });
        animationFrameId = requestAnimationFrame(draw);
    }

    draw();
}