// Modal functions
function showEmailExistsModal() {
  const modal = document.getElementById("emailExistsModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeEmailExistsModal() {
  const modal = document.getElementById("emailExistsModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  }
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("emailExistsModal");
  if (event.target === modal) {
    closeEmailExistsModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeEmailExistsModal();
  }
});

// Add event listener to modal button
document.addEventListener("DOMContentLoaded", function () {
  const modalButton = document.querySelector(".modal-button");
  if (modalButton) {
    modalButton.addEventListener("click", function () {
      closeEmailExistsModal();
    });
  }
});

// Age verification modal functions
function showAgeVerificationModal() {
  const modal = document.getElementById("ageVerificationModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.classList.add("age-modal-active");
  }
}

function closeAgeModal() {
  const modal = document.getElementById("ageVerificationModal");
  if (modal) {
    modal.style.display = "none";
    document.body.classList.remove("age-modal-active");

    // User confirmed they are 18+
    localStorage.setItem("ageVerified", "true");
  }
}

function handleAgeDenial() {
  // User denied being 18+, keep modal open and do nothing
  // The modal will remain visible and the user cannot access the site
}

// Check if user has already verified age
function checkAgeVerification() {
  const ageVerified = localStorage.getItem("ageVerified");
  if (!ageVerified) {
    showAgeVerificationModal();
  }
}

// Initialize age verification on page load
document.addEventListener("DOMContentLoaded", function () {
  checkAgeVerification();

  // Add event listener to age confirmation button
  const ageConfirmButton = document.getElementById("ageConfirmButton");
  if (ageConfirmButton) {
    ageConfirmButton.addEventListener("click", function () {
      closeAgeModal();
    });
  }

  // Add event listener to age denial button
  const ageDenyButton = document.getElementById("ageDenyButton");
  if (ageDenyButton) {
    ageDenyButton.addEventListener("click", function () {
      handleAgeDenial();
    });
  }

  // Add event listeners to CTA buttons
  const ctaButtons = [
    "heroCtaButton",
    "howItWorksCtaButton",
    "pricingCtaButton",
    "securityCtaButton",
  ];

  ctaButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener("click", function () {
        scrollToForm();
      });
    }
  });

  // Add event listener to email modal button
  const emailModalButton = document.getElementById("emailModalButton");
  if (emailModalButton) {
    emailModalButton.addEventListener("click", function () {
      closeEmailExistsModal();
    });
  }
});

// Smooth scrolling and form handling
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  // Function to close mobile menu
  function closeMobileMenu() {
    if (navMenu && navToggle) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (navMenu && navToggle && navMenu.classList.contains("active")) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle = navToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMobileMenu();
      }
    }
  });

  // Handle CTA links in navbar
  const ctaLinks = document.querySelectorAll('a[href="#contato"], .nav-cta');
  ctaLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Close mobile menu if open
      closeMobileMenu();
      scrollToForm();
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Close mobile menu if open
      closeMobileMenu();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }
  });

  // Form submission - Handle both forms
  const leadForm = document.getElementById("leadForm");
  const leadForm2 = document.getElementById("leadForm2");
  const successMessage = document.getElementById("successMessage");
  const successMessage2 = document.getElementById("successMessage2");

  // Function to handle form submission
  function handleFormSubmission(form, successMsg) {
    if (!form) {
      console.error("Form not found:", form);
      return;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      };

      // Format phone number for server
      if (data.phone) {
        // Remove all non-digits
        const digits = data.phone.replace(/\D/g, "");
        // Format as (XX) XXXXX-XXXX
        if (digits.length === 11) {
          data.phone = `(${digits.substring(0, 2)}) ${digits.substring(
            2,
            7
          )}-${digits.substring(7)}`;
        } else if (digits.length === 10) {
          data.phone = `(${digits.substring(0, 2)}) ${digits.substring(
            2,
            6
          )}-${digits.substring(6)}`;
        }
      }

      // Validate form data
      if (!data.name || !data.email || !data.phone) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      // Name validation (only letters and spaces)
      const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
      if (!nameRegex.test(data.name)) {
        alert("Por favor, insira apenas letras no nome.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(data.phone)) {
        alert(
          "Por favor, insira um telefone válido no formato (11) 99999-9999"
        );
        return;
      }

      try {
        // Show loading state
        const submitButton = form.querySelector(".form-submit");
        const originalText = submitButton.textContent;
        submitButton.textContent = "Enviando...";
        submitButton.disabled = true;

        // Send data to backend
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Success
          const result = await response.json();
          form.style.display = "none";
          successMsg.style.display = "block";
          successMsg.scrollIntoView({ behavior: "smooth" });

          // Track conversion (Google Analytics, Facebook Pixel, etc.)
          if (typeof gtag !== "undefined") {
            gtag("event", "conversion", {
              send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
              value: 1.0,
              currency: "BRL",
            });
          }
        } else {
          // Handle different error responses
          const errorData = await response.json();
          if (response.status === 409) {
            showEmailExistsModal();
          } else {
            alert(
              errorData.message || "Erro ao enviar dados. Tente novamente."
            );
          }
          throw new Error(errorData.message || "Erro ao enviar dados");
        }
      } catch (error) {
        // Reset button (moved inside try-catch to ensure variables are in scope)
        const submitButton = form.querySelector(".form-submit");
        if (submitButton) {
          submitButton.textContent = "Garantir Acesso Exclusivo";
          submitButton.disabled = false;
        }

        // Only show alert if it's not a handled error
        if (!error.message.includes("já está cadastrado")) {
          alert("Ocorreu um erro. Tente novamente em alguns instantes.");
        }
      }
    });
  }

  // Apply form handling to both forms
  if (leadForm) {
    handleFormSubmission(leadForm, successMessage);
  }

  if (leadForm2) {
    handleFormSubmission(leadForm2, successMessage2);
  }

  // Phone input formatting for both forms
  const phoneInput = document.getElementById("phone");
  const phoneInput2 = document.getElementById("phone2");

  function formatPhoneInput(input) {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Format based on length
      if (value.length === 0) {
        e.target.value = "";
      } else if (value.length <= 2) {
        e.target.value = `(${value}`;
      } else if (value.length <= 6) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else if (value.length <= 10) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(
          2,
          6
        )}-${value.substring(6)}`;
      } else {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(
          2,
          7
        )}-${value.substring(7, 11)}`;
      }
    });

    // Allow normal editing (backspace, delete, etc.)
    input.addEventListener("keydown", function (e) {
      // Allow backspace, delete, arrow keys, tab, etc.
      if (
        [8, 9, 27, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && e.ctrlKey === true) || // Ctrl+A
        (e.keyCode >= 35 && e.keyCode <= 40)
      ) {
        // End, Home, Arrow keys
        return;
      }
      // Allow only numbers
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    });
  }

  if (phoneInput) {
    formatPhoneInput(phoneInput);
  }

  if (phoneInput2) {
    formatPhoneInput(phoneInput2);
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".feature-card, .why-now-item, .testimonial-content"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
});

// Scroll to form function
function scrollToForm() {
  try {
    // Try multiple selectors to find the form section
    let formSection = document.getElementById("contato");

    if (!formSection) {
      formSection = document.querySelector(".cta-section");
    }

    if (!formSection) {
      formSection = document.querySelector('section[class*="cta"]');
    }

    if (!formSection) {
      console.error(
        "Form section not found! Available sections:",
        Array.from(document.querySelectorAll("section")).map(
          (s) => s.id || s.className
        )
      );
      return;
    }

    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 120;
    const targetPosition = formSection.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Error in scrollToForm:", error);

    // Fallback: try to scroll to the bottom of the page
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
}

// Add mobile menu styles
const style = document.createElement("style");
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 50px;
            transition: left 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu .nav-link {
            margin: 20px 0;
            font-size: 1.2rem;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);
