// Animation utility functions
const animations = {
  fadeIn: (element, { y = 0, x = 0, duration = 0.8, stagger = 0.6 } = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y,
        x,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        ease: "power3.inOut",
        stagger: {
          amount: stagger,
          from: "start",
          ease: "power1.inOut",
        },
      }
    );
  },

  setVisibility: (element, isVisible) => {
    gsap.set(element, {
      y: "0%",
      visibility: isVisible ? "visible" : "hidden",
      opacity: isVisible ? 1 : 0,
      height: isVisible ? "auto" : 0,
    });
  },

  toggleBackground: (bgType = "default") => {
    const backgrounds = ["default", "phase-1", "phase-2", "phase-3"];
    backgrounds.forEach((type) => {
      gsap.set(`.onboarding-modal__bg.--${type}`, { opacity: 0 });
    });

    gsap.set(`.onboarding-modal__bg.--${bgType}`, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    });
  },
};

// Section configuration
const sections = {
  services: { selector: ".services", background: "default" },
  tradingSystem: { 
    selector: ".trading-system", 
    background: "default",
    animations: [
      { elements: ".trading-system__fade-up", params: { y: 20 } },
      { elements: ".trading-system__content__row", params: { x: 20 }, timing: "-=0.4" }
    ]
  },
  phase1: {
    selector: ".phase-1",
    background: "phase-1",
    animations: [
      { elements: ".phase-1__heading", params: { y: -80, duration: 0.5 } },
      { elements: ".phase-1__content__row", params: { x: 80 }, timing: "-=0.2" }
    ]
  },
  phase2: {
    selector: ".phase-2",
    background: "phase-2",
    animations: [
      { elements: ".phase-2__heading", params: { y: 80, duration: 0.5 } },
      { elements: ".phase-2__content__row", params: { x: 80 }, timing: "-=0.2" }
    ]
  },
  phase3: {
    selector: ".phase-3",
    background: "phase-3",
    animations: [
      { elements: ".phase-3__heading", params: { y: 80, duration: 0.5 } },
      { elements: ".phase-3__fade-up", params: { y: 20 } },
    ]
  }
};

// Section management utility
const sectionManager = {
  showSection: (sectionKey) => {
    const tl = gsap.timeline();
    const section = sections[sectionKey];
    
    // Hide all sections except services (which has special handling)
    Object.entries(sections).forEach(([key, config]) => {
      if (key !== 'services') {
        animations.setVisibility(config.selector, false);
      }
    });

    // Show target section
    animations.setVisibility(section.selector, true);
    animations.toggleBackground(section.background);

    // Play section-specific animations
    if (section.animations) {
      section.animations.forEach(({ elements, params, timing }) => {
        if (timing) {
          tl.add(animations.fadeIn(elements, params), timing);
        } else {
          tl.add(animations.fadeIn(elements, params));
        }
      });
    }

    return tl;
  }
};

// Section managers
const sectionManagers = {
  showOnboardingModal: () => {
    const tl = gsap.timeline();

    tl.to(".onboarding-modal", {
      duration: 0.8,
      y: "0%",
      ease: "power3.inOut",
      onStart: () => document.body.classList.add("overlay-open"),
    }).from(".services__button", {
      duration: 0.5,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.inOut",
    });
  },

  showTradingSystem: () => {
    animations.setVisibility(".services", false);
    sectionManager.showSection('tradingSystem');
  },

  showPhase1: () => sectionManager.showSection('phase1'),
  showPhase2: () => sectionManager.showSection('phase2'),
  showPhase3: () => sectionManager.showSection('phase3'),

  closeOnboardingModal: () => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("overlay-open");
        animations.setVisibility(".services", true);
        animations.toggleBackground("default");
        gsap.set(".onboarding-modal__close-button", { rotation: 0 });
        
        // Hide all sections except services
        Object.values(sections).forEach(section => {
          if (section.selector !== ".services") {
            animations.setVisibility(section.selector, false);
          }
        });
      },
    });

    tl.to(".onboarding-modal__close-button", {
      rotation: 80,
      duration: 0.4,
      ease: "power2.inOut",
    }).to(".onboarding-modal", {
      duration: 0.8,
      y: "100%",
      ease: "power3.inOut",
    });
  },
};

// Initialize onboarding
document.addEventListener("DOMContentLoaded", () => {
  const onboardingWrapper = document.querySelector(".onboarding-wrapper");
  if (!onboardingWrapper) return;

  // Event listeners
  document
    .querySelector(".onboarding__button__next")
    .addEventListener("click", sectionManagers.showOnboardingModal);

  document.querySelectorAll(".navigate__trading-system").forEach((button) => {
    button.addEventListener("click", sectionManagers.showTradingSystem);
  });

  document.querySelectorAll(".navigate__phase-1").forEach((button) => {
    button.addEventListener("click", sectionManagers.showPhase1);
  });

  document.querySelectorAll(".navigate__phase-2").forEach((button) => {
    button.addEventListener("click", sectionManagers.showPhase2);
  });

  document.querySelectorAll(".navigate__phase-3").forEach((button) => {
    button.addEventListener("click", sectionManagers.showPhase3);
  });

  document
    .querySelector(".onboarding-modal__close-button")
    .addEventListener("click", sectionManagers.closeOnboardingModal);
});