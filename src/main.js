import "./assets/style.css";

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

// Slider Functionality
const initSlider = () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000);
};

// Initialize Locomotive Scroll for smooth scrolling
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  multiplier: 2, // Increased multiplier makes scrolling faster
});

// Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initSlider();
  AOS.init({ duration: 1000, once: true });

  // Update footer year if an element with id "year" exists
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

function initFooterWave() {
  const canvas = document.getElementById("footer-wave");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Set fixed canvas height and update width dynamically
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = 120);

  // Wave properties for the first (background) wave
  const wave1 = {
    amplitude: 20,
    frequency: 0.02,
    speed: 0.05,
    phase: 0,
    offset: 0, // Vertical offset
  };

  // Wave properties for the second (foreground) wave
  const wave2 = {
    amplitude: 15,
    frequency: 0.025,
    speed: 0.04,
    phase: 0,
    offset: 10, // Slight upward shift for layering effect
  };

  function drawWave() {
    ctx.clearRect(0, 0, width, height);

    // Get primary and accent colors from CSS
    let primaryColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim() || "#e67e22";
    let accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim() || "#2ecc71";

    // Create a horizontal gradient from primary to accent color
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, accentColor);

    // Draw the first wave (background) with gradient fill
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x++) {
      const y =
        wave1.amplitude * Math.sin(x * wave1.frequency + wave1.phase) +
        height / 2 -
        wave1.offset;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw the second wave (foreground) with a semi-transparent primary color
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x++) {
      const y =
        wave2.amplitude * Math.sin(x * wave2.frequency + wave2.phase) +
        height / 2 -
        wave2.offset;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0; // Reset transparency

    // Update the phase values for continuous animation
    wave1.phase += wave1.speed;
    wave2.phase += wave2.speed;
    requestAnimationFrame(drawWave);
  }

  drawWave();

  // Adjust canvas width on window resize while keeping height fixed
  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = 120;
  });
}

function scrollToTop() {
  if (typeof locoScroll !== "undefined" && locoScroll) {
    locoScroll.scrollTo(0, { duration: 1000, easing: [0.25, 0.0, 0.35, 1.0] });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initFooterWave();
  initSlider();
  AOS.init({ duration: 1000, once: true });

  // Update footer year if an element with id "year" exists
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize flatpickr for the inline calendar.
  flatpickr("#consultation-calendar", {
    inline: true,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true,
    onChange: function (selectedDates, dateStr, instance) {
      // Update the hidden date input.
      document.getElementById("selected-date").value = dateStr;
      checkFormCompletion();
    },
  });

  // Handle visual time slot selection.
  const timeslotButtons = document.querySelectorAll(".timeslot");
  timeslotButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove the 'selected' class from all time slots.
      timeslotButtons.forEach((b) => b.classList.remove("selected"));
      // Mark the clicked time slot as selected.
      this.classList.add("selected");
      // Update the hidden time input with the chosen time.
      document.getElementById("selected-time").value =
        this.getAttribute("data-time");
      checkFormCompletion();
    });
  });

  // Function to check if all required fields are filled.
  const form = document.getElementById("booking-form");
  const submitButton = document.querySelector(".submit-box button");

  function checkFormCompletion() {
    // Collect all required inputs within the form.
    const requiredFields = form.querySelectorAll("input[required]");
    let allFilled = true;
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        allFilled = false;
      }
    });
    // Enable the submit button only if every required field is populated.
    submitButton.disabled = !allFilled;
  }

  // Add input listeners for text-based fields.
  const textInputs = form.querySelectorAll(
    "input[type='text'], input[type='email'], input[type='tel']"
  );
  textInputs.forEach((input) => {
    input.addEventListener("input", checkFormCompletion);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.querySelector(".flatpickr-calendar");
  if (calendar) {
    calendar.style.width = "auto";
    calendar.style.height = "auto";
  }
});
flatpickr("#consultation-calendar", {
  inline: true,
  static: true, // Prevents it from being detached
  onReady: function () {
    setTimeout(() => {
      const calendar = document.querySelector(".flatpickr-calendar");
      if (calendar) {
        calendar.style.width = "auto";
        calendar.style.height = "auto";
      }
    }, 100);
  },
});
window.addEventListener("load", function () {
  flatpickr("#consultation-calendar", {
    inline: true,
    static: true,
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.querySelector(".flatpickr-calendar");
  if (calendar) {
    calendar.style.display = "none";
    setTimeout(() => {
      calendar.style.display = "block";
    }, 100);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const flatpickrInstance = flatpickr("#consultation-calendar", {
    inline: true,
    static: true,
  });

  // Force redraw
  setTimeout(() => {
    flatpickrInstance.redraw();
  }, 100);
});
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Pikaday inline
  var picker = new Pikaday({
    container: document.getElementById("pikaday-container"),
    bound: false, // Do not bind to an input field (we're rendering inline)
    format: "YYYY-MM-DD",
    onSelect: function () {
      // When a date is selected, update the hidden input field
      document.getElementById("selected-date").value = picker
        .getDate()
        .toISOString()
        .split("T")[0];
    },
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var picker = new Pikaday({
    container: document.getElementById("pikaday-container"),
    bound: false, // Render inline
    format: "YYYY-MM-DD",
    onSelect: function () {
      // Update the hidden input when a date is selected.
      document.getElementById("selected-date").value = picker
        .getDate()
        .toISOString()
        .split("T")[0];
    },
  });
});
let currentSlide = 0;
const slides = document.querySelectorAll(".slider-container .slide");
const totalSlides = slides.length;
const intervalTime = 5000; // 5 seconds
let slideInterval;

// Function to show a specific slide
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  currentSlide = index;
}

// Automatic slide advance
function startSlideShow() {
  slideInterval = setInterval(() => {
    let nextSlide = (currentSlide + 1) % totalSlides;
    showSlide(nextSlide);
  }, intervalTime);
}

// Manual navigation via arrow buttons
document.querySelector(".slider-arrow.left").addEventListener("click", () => {
  clearInterval(slideInterval);
  let prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(prevSlide);
  startSlideShow();
});

document.querySelector(".slider-arrow.right").addEventListener("click", () => {
  clearInterval(slideInterval);
  let nextSlide = (currentSlide + 1) % totalSlides;
  showSlide(nextSlide);
  startSlideShow();
});

// Start the slideshow automatically
startSlideShow();
