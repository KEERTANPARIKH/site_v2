particlesJS("particles-js", {
  particles: {
    number: { value: 150, density: { enable: true, value_area: 500 } },
    color: { value: "#e67e22" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#e67e22",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "window", // Capture mouse events from the entire window
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      repulse: {
        distance: 40, // When the cursor is within 50px, the effect triggers immediately.
        duration: 0.2, // The effect lasts 0.2 seconds (almost instant).
      },
      push: { particles_nb: 4 },
    },
  },
  retina_detect: true,
});
