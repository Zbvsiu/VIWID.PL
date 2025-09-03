// GSAP scroll animations
gsap.registerPlugin(ScrollTrigger);

// Hero title animation
gsap.from(".hero-title", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
});

// Hero subtitle animation with a slight delay
gsap.from(".hero-subtitle", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.5,
});

// General section animation on scroll
const sections = document.querySelectorAll("section:not(.hero-section)");
sections.forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
        },
    });
});

// Animate title and text on scroll
const aboutTitle = document.querySelector(".about-section .section-title");
const aboutText = document.querySelector(".about-text");

gsap.from(aboutTitle, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: aboutTitle,
        start: "top 90%",
    },
});

gsap.from(aboutText, {
    x: -50,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out",
    scrollTrigger: {
        trigger: aboutText,
        start: "top 90%",
    },
});

// Projects section animations
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card, index) => {
    gsap.from(card, {
        y: 50,
        opacity: 0,
        rotationY: index % 2 === 0 ? 30 : -30,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
        },
    });
});

// Contact form fields animation
const formFields = document.querySelectorAll(".form-group");
gsap.from(formFields, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#contact-form",
        start: "top 80%",
    },
});

// Submit button animation
const submitBtn = document.querySelector(".submit-btn");
gsap.from(submitBtn, {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: submitBtn,
        start: "top 95%",
    },
});