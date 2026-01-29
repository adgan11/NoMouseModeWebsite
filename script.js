// Interactive Keyboard Demo
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('demoCursor');
    const keyboardDemo = document.getElementById('keyboardDemo');
    const keys = document.querySelectorAll('.key');

    let cursorX = 0;
    let cursorY = 0;
    const speed = 8;
    const pressedKeys = new Set();

    // Get demo bounds
    const getDemoBounds = () => {
        const rect = keyboardDemo.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height
        };
    };

    // Update cursor position
    const updateCursor = () => {
        const bounds = getDemoBounds();
        const maxX = bounds.width / 2 - 20;
        const maxY = bounds.height / 2 - 40;

        let dx = 0;
        let dy = 0;

        if (pressedKeys.has('w')) dy -= speed;
        if (pressedKeys.has('s')) dy += speed;
        if (pressedKeys.has('a')) dx -= speed;
        if (pressedKeys.has('d')) dx += speed;

        // Diagonal normalization
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        cursorX = Math.max(-maxX, Math.min(maxX, cursorX + dx));
        cursorY = Math.max(-maxY, Math.min(maxY, cursorY + dy));

        cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px))`;

        if (pressedKeys.size > 0) {
            requestAnimationFrame(updateCursor);
        }
    };

    // Handle key press
    const handleKeyDown = (key) => {
        const keyLower = key.toLowerCase();
        if (['w', 'a', 's', 'd', 'space'].includes(keyLower)) {
            if (!pressedKeys.has(keyLower)) {
                pressedKeys.add(keyLower);

                // Update visual
                const keyEl = document.querySelector(`[data-key="${keyLower === ' ' ? 'space' : keyLower}"]`);
                if (keyEl) keyEl.classList.add('active');

                // Start animation loop
                if (pressedKeys.size === 1 && keyLower !== 'space') {
                    requestAnimationFrame(updateCursor);
                }

                // Click animation for space
                if (keyLower === 'space') {
                    cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px)) scale(0.8)`;
                    cursor.style.boxShadow = '0 0 30px var(--accent), 0 0 60px var(--accent)';
                }
            }
        }
    };

    const handleKeyUp = (key) => {
        const keyLower = key.toLowerCase();
        pressedKeys.delete(keyLower);

        // Update visual
        const keyEl = document.querySelector(`[data-key="${keyLower === ' ' ? 'space' : keyLower}"]`);
        if (keyEl) keyEl.classList.remove('active');

        // Reset click animation
        if (keyLower === 'space') {
            cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px)) scale(1)`;
            cursor.style.boxShadow = '0 0 20px var(--accent)';
        }
    };

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') e.preventDefault();
        handleKeyDown(e.key === ' ' ? 'space' : e.key);
    });

    document.addEventListener('keyup', (e) => {
        handleKeyUp(e.key === ' ' ? 'space' : e.key);
    });

    // Mouse/touch events for keys
    keys.forEach(key => {
        const keyValue = key.dataset.key;

        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleKeyDown(keyValue);
        });

        key.addEventListener('mouseup', () => {
            handleKeyUp(keyValue);
        });

        key.addEventListener('mouseleave', () => {
            handleKeyUp(keyValue);
        });

        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleKeyDown(keyValue);
        });

        key.addEventListener('touchend', () => {
            handleKeyUp(keyValue);
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
