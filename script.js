/**********************************************
 * 1) HAMBURGER MENU
 **********************************************/
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded – navbar controller running...");

  const hamburger = document.getElementById("hamburger");
  const navbar = document.getElementById("navbar");
  const logoImage = document.querySelector(".logo-image");
  const hero = document.querySelector(".hero");

  if (!hamburger || !navbar) {
    console.error("Could not find #hamburger or #navbar elements in the DOM.");
    return;
  }

  function updateNavbarState() {
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    const isScrolled = window.scrollY > heroHeight - 80;
    const isMenuOpen = navbar.classList.contains("active");

    if (isScrolled || isMenuOpen) {
      if (!navbar.classList.contains("header-active")) {
        navbar.classList.add("header-active");
      }
      if (logoImage && !logoImage.src.includes("Logo_dark_j9mzl6.svg")) {
        logoImage.src = "https://res.cloudinary.com/dpaulzah2/image/upload/v1782250703/Logo_dark_j9mzl6.svg";
      }
    } else {
      if (navbar.classList.contains("header-active")) {
        navbar.classList.remove("header-active");
      }
      if (logoImage && !logoImage.src.includes("Logo_light_deltoa.svg")) {
        logoImage.src = "https://res.cloudinary.com/dpaulzah2/image/upload/v1782250641/Logo_light_deltoa.svg";
      }
    }
  }

  // Toggle active class on click
  hamburger.addEventListener("click", () => {
    console.log("Hamburger clicked. Toggling menu active state...");
    navbar.classList.toggle("active");
    updateNavbarState();
  });

  // Listen for scroll events
  window.addEventListener("scroll", updateNavbarState);

  // Initial state check
  updateNavbarState();
});

/**********************************************
 * 2) REVIEWS SCROLL ARROWS
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – reviews scroll script running...");

  const reviewsScroll = document.querySelector(".reviews-scroll");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (!reviewsScroll || !leftArrow || !rightArrow) {
    console.error(
      "Could not find .reviews-scroll, .left-arrow, or .right-arrow elements."
    );
    return;
  }

  let currentTranslate = 0;

  function getScrollAmount() {
    const cards = reviewsScroll.querySelectorAll(".review-card");
    if (cards.length > 0) {
      const card = cards[0];
      const style = window.getComputedStyle(reviewsScroll);
      const gap = parseInt(style.gap) || 24;
      return card.offsetWidth + gap;
    }
    return 423;
  }

  function getMaxTranslate() {
    const cards = reviewsScroll.querySelectorAll(".review-card");
    if (cards.length === 0) return 0;
    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(reviewsScroll);
    const gap = parseInt(style.gap) || 24;
    const totalWidth = (cards.length * cardWidth) + ((cards.length - 1) * gap);
    
    // Width of the container (1440px max grid content width)
    const container = document.querySelector(".reviews-section .container");
    const containerWidth = container ? container.clientWidth : 1280;
    
    return Math.max(0, totalWidth - containerWidth);
  }

  function updateArrowStates() {
    const isDesktop = window.innerWidth >= 1200;
    
    if (isDesktop) {
      const maxTranslate = getMaxTranslate();
      
      // Left arrow disabled at start
      if (currentTranslate <= 5) {
        leftArrow.classList.add("disabled");
        leftArrow.setAttribute("disabled", "true");
        leftArrow.setAttribute("aria-disabled", "true");
      } else {
        leftArrow.classList.remove("disabled");
        leftArrow.removeAttribute("disabled");
        leftArrow.removeAttribute("aria-disabled");
      }

      // Right arrow disabled at end
      if (currentTranslate >= maxTranslate - 5) {
        rightArrow.classList.add("disabled");
        rightArrow.setAttribute("disabled", "true");
        rightArrow.setAttribute("aria-disabled", "true");
      } else {
        rightArrow.classList.remove("disabled");
        rightArrow.removeAttribute("disabled");
        rightArrow.removeAttribute("aria-disabled");
      }
    } else {
      const scrollLeft = reviewsScroll.scrollLeft;
      const maxScroll = reviewsScroll.scrollWidth - reviewsScroll.clientWidth;

      if (scrollLeft <= 5) {
        leftArrow.classList.add("disabled");
        leftArrow.setAttribute("disabled", "true");
        leftArrow.setAttribute("aria-disabled", "true");
      } else {
        leftArrow.classList.remove("disabled");
        leftArrow.removeAttribute("disabled");
        leftArrow.removeAttribute("aria-disabled");
      }

      if (scrollLeft >= maxScroll - 5) {
        rightArrow.classList.add("disabled");
        rightArrow.setAttribute("disabled", "true");
        rightArrow.setAttribute("aria-disabled", "true");
      } else {
        rightArrow.classList.remove("disabled");
        rightArrow.removeAttribute("disabled");
        rightArrow.removeAttribute("aria-disabled");
      }
    }
  }

  rightArrow.addEventListener("click", () => {
    const isDesktop = window.innerWidth >= 1200;
    const scrollAmount = getScrollAmount();
    
    if (isDesktop) {
      const maxTranslate = getMaxTranslate();
      currentTranslate = Math.min(currentTranslate + scrollAmount, maxTranslate);
      reviewsScroll.style.transform = `translateX(-${currentTranslate}px)`;
      updateArrowStates();
    } else {
      reviewsScroll.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  });

  leftArrow.addEventListener("click", () => {
    const isDesktop = window.innerWidth >= 1200;
    const scrollAmount = getScrollAmount();
    
    if (isDesktop) {
      currentTranslate = Math.max(currentTranslate - scrollAmount, 0);
      reviewsScroll.style.transform = `translateX(-${currentTranslate}px)`;
      updateArrowStates();
    } else {
      reviewsScroll.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  });

  // Scroll listener for mobile/tablet swipes
  reviewsScroll.addEventListener("scroll", updateArrowStates);

  // Resize listener to sync translate / scroll states
  window.addEventListener("resize", () => {
    const isDesktop = window.innerWidth >= 1200;
    if (!isDesktop) {
      reviewsScroll.style.transform = "none";
      currentTranslate = 0;
    }
    updateArrowStates();
  });

  // Initial state check
  updateArrowStates();
});

/**********************************************
 * 3) CONTACT FORM & TAG SELECTION
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – contact form script running...");

  const tagContainer = document.getElementById("tagContainer");
  const contactForm = document.getElementById("contactForm");

  // --- 3a) Tag selection logic ---
  if (tagContainer) {
    console.log("tagContainer found:", tagContainer);

    // Example: If you want one tag selected by default
    const initialSelectedTag = tagContainer.querySelector(
      '.tag[data-value="Handbags"]'
    );
    if (initialSelectedTag) {
      console.log("Found default tag (Handbags). Marking as selected...");
      initialSelectedTag.setAttribute("data-selected", "true");
    }

    tagContainer.addEventListener("click", (e) => {
      const tag = e.target.closest(".tag");
      if (!tag) return;

      // Toggle "data-selected" between "true" and "false"
      const currentlySelected = tag.getAttribute("data-selected") === "true";
      console.log("Tag clicked:", tag, "Was selected?", currentlySelected);

      tag.setAttribute("data-selected", currentlySelected ? "false" : "true");
    });
  } else {
    console.warn("No tagContainer (#tagContainer) found in DOM.");
  }

  // --- 3b) Form submission logic ---
  if (contactForm) {
    console.log("contactForm found:", contactForm);

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Form submit event triggered.");

      // Collect form data (replace with dynamic categories if you want to read them from the tags)
      const payload = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phn: contactForm.phone.value,
        categories: "Handbags,Laptop Bags", // For example
        request: contactForm.message.value,
      };

      console.log("Payload to send:", payload);

      try {
        console.log("Sending fetch request...");
        const response = await fetch(
          // IMPORTANT: Use your deployed Web App URL
          "https://script.google.com/macros/s/AKfycbxBPGvzsF0HPxj18GnApTgmojAutNjkWFBsMuppTPkS7G-0eM4xkMgunuWgALsdV7f2iw/exec",
          {
            method: "POST",
            redirect: "follow", // <-- Very important for Google redirect
            headers: {
              // Using "text/plain" to avoid preflight and skip strict CORS checks
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload),
          }
        );

        console.log("Fetch complete. HTTP status:", response.status);

        if (!response.ok) {
          console.error("Network response was not OK. Throwing error...");
          throw new Error("Network response was not OK");
        }

        const data = await response.json();
        console.log("JSON response from server:", data);

        if (data.status === "success") {
          alert("Message sent!");
          contactForm.reset();
        } else {
          console.warn("Server responded with an error status:", data);
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message due to a network or CORS error.");
      }
    });
  } else {
    console.warn("No contactForm (#contactForm) found in DOM.");
  }
});

/**********************************************
 * 4) SCROLL TO TOP BUTTON
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – scroll to top script running...");

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) {
    console.warn("No scrollTopBtn (#scrollTopBtn) found in DOM.");
    return;
  }

  scrollTopBtn.addEventListener("click", () => {
    console.log("scrollTopBtn clicked. Scrolling to top...");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/**********************************************
 * 5) NAVBAR SCROLL (Sticky Header - Consolidated into Section 1)
 **********************************************/

/**********************************************
 * 6) DYNAMIC COPYRIGHT YEAR
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = new Date().getFullYear();
  const copyrightYearEl = document.getElementById("copyrightYear");
  if (copyrightYearEl) {
    copyrightYearEl.textContent = currentYear;
  }
});
