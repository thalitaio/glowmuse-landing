// Smooth scrolling and form handling
console.log("Script.js loaded!");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, setting up forms...");
  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Handle CTA links in navbar
  const ctaLinks = document.querySelectorAll('a[href="#contato"], .nav-cta');
  ctaLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToForm();
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
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
            alert("Este e-mail já está cadastrado em nossa lista de espera.");
          } else {
            alert(
              errorData.message || "Erro ao enviar dados. Tente novamente."
            );
          }
          throw new Error(errorData.message || "Erro ao enviar dados");
        }
      } catch (error) {
        console.error("Error:", error);

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
      if (value.length >= 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length >= 10) {
        value = value.substring(0, 10) + "-" + value.substring(10, 14);
      }
      e.target.value = value;
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
    console.log("scrollToForm called"); // Debug

    // Try multiple selectors to find the form section
    let formSection = document.getElementById("contato");

    if (!formSection) {
      formSection = document.querySelector(".cta-section");
    }

    if (!formSection) {
      formSection = document.querySelector('section[class*="cta"]');
    }

    console.log("formSection found:", formSection); // Debug

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

    console.log("Header height:", headerHeight);
    console.log("Form section top:", formSection.offsetTop);
    console.log("Scrolling to position:", targetPosition);

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });

    console.log("Scroll initiated successfully");
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
