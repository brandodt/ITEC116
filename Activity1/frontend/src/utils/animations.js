import { gsap } from 'gsap';

/**
 * Animation utilities for the application
 */
export const animations = {
    /**
     * Slide down and fade in an element
     * @param {HTMLElement} element - The element to animate
     * @param {number} duration - Animation duration in seconds
     * @param {number} delay - Animation delay in seconds
     * @param {Function} onComplete - Callback function after animation completes
     */
    slideDown: (element, duration = 0.5, delay = 0, onComplete = null) => {
        if (!element) return;

        // First set initial state
        gsap.set(element, {
            height: 0,
            opacity: 0,
            overflow: 'hidden',
            display: 'block'
        });

        // Then animate to auto height
        gsap.to(element, {
            height: 'auto',
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: 'power2.out',
            onComplete: onComplete
        });
    },

    /**
     * Slide up and fade out an element
     * @param {HTMLElement} element - The element to animate
     * @param {number} duration - Animation duration in seconds
     * @param {Function} onComplete - Callback function after animation completes
     */
    slideUp: (element, duration = 0.4, onComplete = null) => {
        if (!element) return;

        gsap.to(element, {
            height: 0,
            opacity: 0,
            duration: duration,
            ease: 'power2.in',
            onComplete: () => {
                gsap.set(element, { display: 'none' });
                if (onComplete) onComplete();
            }
        });
    },

    /**
     * Fade in an element
     * @param {HTMLElement} element - The element to animate
     * @param {number} duration - Animation duration in seconds
     */
    fadeIn: (element, duration = 0.3) => {
        if (!element) return;

        gsap.fromTo(element,
            { opacity: 0 },
            { opacity: 1, duration: duration, ease: 'power1.inOut' }
        );
    },

    /**
     * Scale in an element
     * @param {HTMLElement} element - The element to animate
     * @param {number} duration - Animation duration in seconds
     */
    scaleIn: (element, duration = 0.4) => {
        if (!element) return;

        gsap.fromTo(element,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: duration, ease: 'back.out(1.2)' }
        );
    }
};

export default animations;
