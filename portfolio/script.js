document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formMessage = document.getElementById("form-message");
    const submitButton = contactForm.querySelector("button");
    const successModal = document.getElementById("success-modal");
    const closeModal = document.getElementById("close-modal");

    // Load saved form data from localStorage
    [nameInput, emailInput, messageInput].forEach(input => {
        if (localStorage.getItem(input.id)) input.value = localStorage.getItem(input.id);
    });

    // Debounce function to optimize localStorage writes
    function debounce(func, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Save form data on input change (debounced)
    contactForm.addEventListener("input", debounce(() => {
        localStorage.setItem("name", nameInput.value);
        localStorage.setItem("email", emailInput.value);
        localStorage.setItem("message", messageInput.value);
    }));

    // Validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Show form messages
    function showMessage(text, color) {
        formMessage.textContent = text;
        formMessage.style.color = color;
        formMessage.style.opacity = "1";
        setTimeout(() => { formMessage.style.opacity = "0"; }, 3000);
    }

    // Show success modal & trigger confetti animation
    function showSuccessModal() {
        successModal.style.display = "flex";
        launchConfetti(); // Trigger confetti animation
    }

    // Close modal event
    closeModal.addEventListener("click", () => successModal.style.display = "none");

    // Close modal when clicking outside or pressing Escape key
    window.addEventListener("click", (event) => {
        if (event.target === successModal) successModal.style.display = "none";
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") successModal.style.display = "none";
    });

    // Form submission
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let message = messageInput.value.trim();

        // Validation
        if (!name || !email || !message) return showMessage("Please fill in all fields.", "red");
        if (!isValidEmail(email)) return showMessage("Please enter a valid email address.", "red");

        // Disable button to prevent spam
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        // Send form using FormSubmit with auto-reply
        fetch("https://formsubmit.co/ajax/aduraayeni5@gmail.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                message,
                _autoresponse: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you soon.\n\nBest,\nOmotayo Ayeni`
            })
        })
        .then(response => {
            if (!response.ok) throw new Error("Network error occurred.");
            return response.json();
        })
        .then(() => {
            showMessage("Message sent successfully!", "green");
            showSuccessModal();

            // Clear form fields and localStorage
            contactForm.reset();
            localStorage.clear();

            // Success animation on button
            submitButton.innerHTML = "✔️ Sent!";
            setTimeout(() => {
                submitButton.innerHTML = "Send Message";
                submitButton.disabled = false;
            }, 2000);
        })
        .catch((error) => {
            console.error("Form submission error:", error);
            showMessage("Failed to send message. Try again later.", "red");
            submitButton.textContent = "Send Message";
            submitButton.disabled = false;
        });
    });

    // Confetti animation with error handling
    function launchConfetti() {
        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            console.warn("Confetti script not loaded.");
        }
    }
});
