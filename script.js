// Smooth scrolling and form handling
document.addEventListener("DOMContentLoaded", function () {
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

  // Form submission
  const leadForm = document.getElementById("leadForm");
  const successMessage = document.getElementById("successMessage");

  if (leadForm) {
    leadForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(leadForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      };

      // Validate form data
      if (!data.name || !data.email || !data.phone) {
        alert("Por favor, preencha todos os campos.");
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
        const submitButton = leadForm.querySelector(".form-submit");
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
          leadForm.style.display = "none";
          successMessage.style.display = "block";
          successMessage.scrollIntoView({ behavior: "smooth" });

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
        const submitButton = leadForm.querySelector(".form-submit");
        if (submitButton) {
          submitButton.textContent = "Entrar na lista de espera";
          submitButton.disabled = false;
        }

        // Only show alert if it's not a handled error
        if (!error.message.includes("já está cadastrado")) {
          alert("Ocorreu um erro. Tente novamente em alguns instantes.");
        }
      }
    });
  }

  // Phone input formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
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
