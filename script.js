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
      if (logoImage && !logoImage.src.includes("Logo_light_deltoa.svg")) {
        logoImage.src = "https://res.cloudinary.com/dpaulzah2/image/upload/v1782250641/Logo_light_deltoa.svg";
      }
    } else {
      if (navbar.classList.contains("header-active")) {
        navbar.classList.remove("header-active");
      }
      if (logoImage && !logoImage.src.includes("Logo_dark_j9mzl6.svg")) {
        logoImage.src = "https://res.cloudinary.com/dpaulzah2/image/upload/v1782250703/Logo_dark_j9mzl6.svg";
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
    const isDesktop = window.innerWidth >= 992;
    
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
    const isDesktop = window.innerWidth >= 992;
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
    const isDesktop = window.innerWidth >= 992;
    const scrollAmount = getScrollAmount();
    
    if (isDesktop) {
      currentTranslate = Math.max(currentTranslate - scrollAmount, 0);
      reviewsScroll.style.transform = `translateX(-${currentTranslate}px)`;
      updateArrowStates();
    } else {
      reviewsScroll.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  });

  // Touch/swipe gestures for tablet/desktop translation
  let touchStartX = 0;
  let touchEndX = 0;

  reviewsScroll.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  reviewsScroll.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const isDesktop = window.innerWidth >= 992;
    if (!isDesktop) return; // Native swipe active on mobile

    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      const scrollAmount = getScrollAmount();
      if (diff > 0) {
        // Swipe left -> go right
        const maxTranslate = getMaxTranslate();
        currentTranslate = Math.min(currentTranslate + scrollAmount, maxTranslate);
        reviewsScroll.style.transform = `translateX(-${currentTranslate}px)`;
        updateArrowStates();
      } else {
        // Swipe right -> go left
        currentTranslate = Math.max(currentTranslate - scrollAmount, 0);
        reviewsScroll.style.transform = `translateX(-${currentTranslate}px)`;
        updateArrowStates();
      }
    }
  }

  // Scroll listener for mobile/tablet swipes
  reviewsScroll.addEventListener("scroll", updateArrowStates);

  // Resize listener to sync translate / scroll states
  window.addEventListener("resize", () => {
    const isDesktop = window.innerWidth >= 992;
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

/**********************************************
 * 7) HERO PROGRESSIVE VIDEO/IMAGE LOADER & ENTRANCE LOADER
 **********************************************/
document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.querySelector(".hero-video");
  if (!heroVideo) return;

  const imageUrl = "https://res.cloudinary.com/dpaulzah2/image/upload/v1782251285/First_frame_dmuxp7.png";
  const videoUrl = "https://res.cloudinary.com/dpaulzah2/video/upload/v1782248512/video_nexus_umuhby.mp4";

  let imageXHR = null;
  let videoXHR = null;
  let imageProgress = 0;
  let videoProgress = 0;
  let imageShown = false;
  let videoShown = false;
  let imageAborted = false;
  let imageBlobUrl = null;
  let videoBlobUrl = null;
  let loaderDismissed = false;

  function showImage(blob) {
    if (imageShown || videoShown) return;
    imageShown = true;
    imageBlobUrl = URL.createObjectURL(blob);
    heroVideo.style.backgroundImage = `url(${imageBlobUrl})`;
    console.log("Hero loader: Showed fallback image.");
    dismissLoader();
  }

  function playVideo(blob) {
    if (videoShown) return;
    videoShown = true;

    // Abort image download if it is still running to save bandwidth
    abortImageDownload("video is ready");

    videoBlobUrl = URL.createObjectURL(blob);
    heroVideo.src = videoBlobUrl;
    heroVideo.load();
    heroVideo.play().catch((err) => {
      console.warn("Autoplay failed or interrupted:", err);
    });
    console.log("Hero loader: Playing video.");
    dismissLoader();
  }

  function dismissLoader() {
    if (loaderDismissed) return;
    loaderDismissed = true;

    console.log("Hero loader: Initiating loader dismiss transition...");

    const loaderOverlay = document.getElementById("loaderOverlay");
    const loaderLogoContainer = document.getElementById("loaderLogoContainer");
    const navLogo = document.querySelector(".logo-image");

    if (!loaderOverlay || !loaderLogoContainer || !navLogo) {
      document.documentElement.classList.remove("loading");
      document.body.classList.remove("loading");
      if (navLogo) navLogo.classList.remove("hidden");
      if (loaderOverlay) loaderOverlay.remove();
      return;
    }

    // 1. Calculate positions using the FLIP technique
    const navLogoRect = navLogo.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Centers of elements
    const navCx = navLogoRect.left + navLogoRect.width / 2;
    const navCy = navLogoRect.top + navLogoRect.height / 2;
    
    const loaderCx = viewportWidth / 2;
    const loaderCy = viewportHeight / 2;
    
    const dx = navCx - loaderCx;
    const dy = navCy - loaderCy;
    
    // Loader logo size is 218.97px by 78px
    const sx = navLogoRect.width / 218.97;
    const sy = navLogoRect.height / 78;

    // 2. Trigger high performance GPU-accelerated morph transition (translate + scale)
    loaderLogoContainer.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    // 3. Trigger columns staggered slide-up
    loaderOverlay.classList.add("exit");

    // 4. After column exit and logo morph transition finishes (1.2s matches CSS transition duration)
    setTimeout(() => {
      // Reveal the navbar logo
      navLogo.classList.remove("hidden");
      navLogo.style.opacity = "1";

      // Fade out the loader logo container
      loaderLogoContainer.style.opacity = "0";

      // Fade out the main loader overlay wrapper
      loaderOverlay.classList.add("fade-out");

      // Complete cleanup after fade-out transition
      setTimeout(() => {
        document.documentElement.classList.remove("loading");
        document.body.classList.remove("loading");
        loaderOverlay.remove();
        loaderLogoContainer.remove();
      }, 500); // 0.5s fade-out duration
    }, 1200); // 1.2s column staggered exit transition duration
  }

  // Safety fallback: Dismiss loader after 8 seconds to prevent user getting stuck
  setTimeout(() => {
    if (!loaderDismissed) {
      console.warn("Hero loader: Safety timeout triggered. Dismissing loader.");
      dismissLoader();
    }
  }, 8000);

  function abortImageDownload(reason) {
    if (imageXHR && imageXHR.readyState !== 4 && imageXHR.readyState !== 0 && !imageAborted) {
      imageAborted = true;
      imageXHR.abort();
      console.log(`Hero loader: Aborting image download (Reason: ${reason}).`);
    }
  }

  function checkProgress() {
    // If video is fully ready (100% loaded in XHR)
    if (videoProgress === 100) {
      if (videoXHR && videoXHR.response) {
        playVideo(videoXHR.response);
      }
      return;
    }

    // Rule 1: If image load reaches 50% and video is ready: immediately play video
    // (This is covered when videoProgress === 100, which calls playVideo immediately).

    // Rule 2: If image load reaches 50% and video is below 80% loaded: show image when it finishes
    if (imageProgress >= 50 && videoProgress < 80) {
      if (imageXHR && imageXHR.status === 200 && imageXHR.response && !imageAborted) {
        showImage(imageXHR.response);
      }
    }

    // Rule 3: If image load >= 50% and video is >= 80% loaded: abort image download to save bandwidth
    if (imageProgress >= 50 && videoProgress >= 80) {
      abortImageDownload(`image at ${imageProgress.toFixed(1)}% and video at ${videoProgress.toFixed(1)}% (>= 80%)`);
    }
  }

  // Start image download
  function startImageDownload() {
    imageAborted = false;
    imageProgress = 0;
    imageXHR = new XMLHttpRequest();
    imageXHR.open("GET", imageUrl, true);
    imageXHR.responseType = "blob";
    imageXHR.onprogress = (e) => {
      if (e.lengthComputable && !imageAborted) {
        imageProgress = (e.loaded / e.total) * 100;
        checkProgress();
      }
    };
    imageXHR.onload = () => {
      if (imageXHR.status === 200 && !imageAborted) {
        imageProgress = 100;
        if (videoProgress < 80 && !videoShown) {
          showImage(imageXHR.response);
        }
      }
    };
    imageXHR.onerror = () => {
      if (!imageAborted) {
        console.error("Hero loader: Image failed to download.");
      }
    };
    imageXHR.send();
  }

  // Start video download
  videoXHR = new XMLHttpRequest();
  videoXHR.open("GET", videoUrl, true);
  videoXHR.responseType = "blob";
  videoXHR.timeout = 25000; // 25s timeout
  videoXHR.onprogress = (e) => {
    if (e.lengthComputable) {
      videoProgress = (e.loaded / e.total) * 100;
      checkProgress();
    }
  };
  videoXHR.onload = () => {
    if (videoXHR.status === 200) {
      videoProgress = 100;
      playVideo(videoXHR.response);
    }
  };
  videoXHR.onerror = handleVideoFailure;
  videoXHR.ontimeout = handleVideoFailure;
  videoXHR.send();

  // Start image download initially
  startImageDownload();

  function handleVideoFailure() {
    console.error("Hero loader: Video download failed or timed out.");
    // Fallback: force finish image if aborted, not started, or finished with error
    if (imageAborted || imageXHR.readyState === 0 || (imageXHR.readyState === 4 && imageXHR.status !== 200)) {
      console.log("Hero loader: Restarting/re-enabling image download as video failed.");
      startImageDownload();
    } else if (imageXHR.status === 200) {
      showImage(imageXHR.response);
    } else {
      console.log("Hero loader: Video failed, but image download is already in progress. Letting it complete.");
    }
  }

  // Expose dismissLoader globally for testing/debugging purposes
  window.__dismissLoader = dismissLoader;
});
