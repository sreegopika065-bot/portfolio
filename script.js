// Run the script only after the page content has loaded.
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-links a");
    const revealItems = document.querySelectorAll(".reveal");
    const skillBars = document.querySelectorAll(".progress-bar span");
    const skillsSection = document.getElementById("skills");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const header = document.querySelector(".header");

    // Toggle the mobile navigation menu.
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // Smooth scrolling for navigation links and close the mobile menu after clicking.
    navItems.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            const targetSection = targetId ? document.querySelector(targetId) : null;

            if (targetSection) {
                event.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const scrollTarget = targetSection.offsetTop - headerHeight + 1;

                window.scrollTo({
                    top: scrollTarget,
                    behavior: "smooth"
                });
            }

            navLinks.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Highlight the current section in the navigation bar while scrolling.
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 140;

        navItems.forEach((link) => {
            const section = document.querySelector(link.getAttribute("href"));

            if (!section) {
                return;
            }

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink);

    // Reveal elements when they enter the viewport.
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

    // Animate the skill bars when the skills section becomes visible.
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !skillsAnimated) {
                    skillBars.forEach((bar) => {
                        const targetWidth = bar.dataset.width;
                        bar.style.width = targetWidth;
                    });

                    skillsAnimated = true;
                }
            });
        },
        {
            threshold: 0.35
        }
    );

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Validate the contact form before showing a success message.
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");
            let isValid = true;

            clearError(nameInput);
            clearError(emailInput);
            clearError(messageInput);
            formStatus.textContent = "";

            if (nameInput.value.trim() === "") {
                showError(nameInput, "Please enter your name.");
                isValid = false;
            }

            if (emailInput.value.trim() === "") {
                showError(emailInput, "Please enter your email.");
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, "Please enter a valid email address.");
                isValid = false;
            }

            if (messageInput.value.trim() === "") {
                showError(messageInput, "Please enter your message.");
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, "Message should contain at least 10 characters.");
                isValid = false;
            }

            if (!isValid) {
                formStatus.textContent = "Please correct the errors before submitting.";
                return;
            }

            formStatus.textContent = "Message submitted successfully.";
            contactForm.reset();
        });
    }

    // Show an error message under the selected input.
    function showError(input, message) {
        const group = input.parentElement;
        const errorText = group.querySelector(".error-message");

        group.classList.add("error");
        errorText.textContent = message;
    }

    // Clear the error message from the selected input.
    function clearError(input) {
        const group = input.parentElement;
        const errorText = group.querySelector(".error-message");

        group.classList.remove("error");
        errorText.textContent = "";
    }

    // Basic email pattern for beginner-friendly validation.
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
