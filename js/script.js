const contactForm = document.querySelector(".contact-form form");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(contactForm);

        try {

            const response = await fetch(
                contactForm.action,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (response.ok) {

                contactForm.innerHTML = `
                    <div class="success-message">

                        <div class="success-icon">
                            ✓
                        </div>

                        <h3>
                            Thank You!
                        </h3>

                        <p>
                            Your enquiry has been submitted successfully.
                        </p>

                        <p>
                            Our team will contact you shortly.
                        </p>

                        <button
                            type="button"
                            class="primary-button"
                            onclick="location.reload()">

                            Send Another Enquiry

                        </button>

                    </div>
                `;

            } else {

                submitButton.disabled = false;
                submitButton.textContent = "Send Enquiry";

                alert(
                    "Something went wrong. Please try again."
                );

            }

        } catch (error) {

            submitButton.disabled = false;
            submitButton.textContent = "Send Enquiry";

            alert(
                "Unable to submit the enquiry. Please check your internet connection and try again."
            );

        }

    });

}