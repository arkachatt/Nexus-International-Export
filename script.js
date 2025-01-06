/**********************************************
 * 1) HAMBURGER MENU
 **********************************************/
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded – hamburger menu script running...");

  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");

  if (!hamburger || !nav) {
    console.error("Could not find #hamburger or .nav elements in the DOM.");
    return;
  }

  hamburger.addEventListener("click", () => {
    console.log("Hamburger clicked. Toggling .active on nav...");
    nav.classList.toggle("active");
  });
});

/**********************************************
 * 2) REVIEWS SCROLL ARROWS
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – reviews scroll script running...");

  const reviewsScroll = document.querySelector(".reviews-scroll");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  const scrollAmount = 300; // Adjust if needed

  if (!reviewsScroll || !leftArrow || !rightArrow) {
    console.error(
      "Could not find .reviews-scroll, .left-arrow, or .right-arrow elements."
    );
    return;
  }

  rightArrow.addEventListener("click", () => {
    console.log("Right arrow clicked. Scrolling right by", scrollAmount);
    reviewsScroll.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  leftArrow.addEventListener("click", () => {
    console.log("Left arrow clicked. Scrolling left by", scrollAmount);
    reviewsScroll.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
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
 * 5) NAVBAR SCROLL (Sticky Header)
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded – sticky navbar script running...");

  const navbar = document.getElementById("navbar");
  if (!navbar) {
    console.warn("No navbar (#navbar) found in DOM.");
    return;
  }

  // Listen for scroll events
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      if (!navbar.classList.contains("header-active")) {
        console.log("Adding .header-active class to navbar...");
        navbar.classList.add("header-active");
      }
    } else {
      if (navbar.classList.contains("header-active")) {
        console.log("Removing .header-active class from navbar...");
        navbar.classList.remove("header-active");
      }
    }
  });
});
