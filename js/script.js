// =====================================================
// INNOVATION LABS CONTACT FORM
// EMAIL VERIFICATION + ENQUIRY
// =====================================================


// =====================================================
// FASTAPI BACKEND URL
// =====================================================

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// GET ELEMENTS
// =====================================================

const contactForm =
    document.querySelector("#enquiryForm");

const emailInput =
    document.querySelector("#email");

const sendOtpButton =
    document.querySelector("#sendOtpButton");

const otpSection =
    document.querySelector("#otpSection");

const otpInput =
    document.querySelector("#otp");

const verifyOtpButton =
    document.querySelector("#verifyOtpButton");

const verificationMessage =
    document.querySelector("#verificationMessage");

const emailVerifiedMessage =
    document.querySelector("#emailVerifiedMessage");

const submitEnquiryButton =
    document.querySelector("#submitEnquiryButton");


// =====================================================
// EMAIL VALIDATION
// =====================================================

function isValidEmail(email) {

    const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);

}


// =====================================================
// SEND OTP
// =====================================================

if (sendOtpButton) {

    sendOtpButton.addEventListener(
        "click",
        async function () {

            const email =
                emailInput.value.trim().toLowerCase();


            // Check email
            if (!isValidEmail(email)) {

                emailInput.setCustomValidity(
                    "Please enter a valid email address."
                );

                emailInput.reportValidity();

                return;

            }


            emailInput.setCustomValidity("");


            // Disable button
            sendOtpButton.disabled = true;

            sendOtpButton.textContent =
                "Sending OTP...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/send-otp`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email
                            })
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    // Show OTP section
                    otpSection.style.display =
                        "block";


                    verificationMessage.textContent =
                        "OTP has been sent to your email.";

                    verificationMessage.style.color =
                        "#f88a1c";


                    sendOtpButton.textContent =
                        "OTP Sent ✓";


                } else {

                    alert(
                        result.message ||
                        "Unable to send OTP."
                    );


                    sendOtpButton.disabled =
                        false;

                    sendOtpButton.textContent =
                        "Verify Email";

                }


            } catch (error) {

                console.error(error);


                alert(
                    "Unable to connect to the email verification server."
                );


                sendOtpButton.disabled =
                    false;

                sendOtpButton.textContent =
                    "Verify Email";

            }

        }
    );

}


// =====================================================
// VERIFY OTP
// =====================================================

if (verifyOtpButton) {

    verifyOtpButton.addEventListener(
        "click",
        async function () {

            const email =
                emailInput.value.trim().toLowerCase();

            const otp =
                otpInput.value.trim();


            // Check OTP
            if (!/^\d{6}$/.test(otp)) {

                verificationMessage.textContent =
                    "Please enter the 6-digit OTP.";

                verificationMessage.style.color =
                    "red";

                return;

            }


            // Disable button
            verifyOtpButton.disabled =
                true;

            verifyOtpButton.textContent =
                "Verifying...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/verify-otp`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                otp: otp

                            })
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    // OTP verified
                    verificationMessage.textContent =
                        "";

                    otpSection.style.display =
                        "none";


                    emailVerifiedMessage.style.display =
                        "block";


                    emailVerifiedMessage.style.color =
                        "green";


                    emailVerifiedMessage.style.fontWeight =
                        "bold";


                    // Disable email editing
                    emailInput.readOnly =
                        true;


                    // Disable verify button
                    sendOtpButton.disabled =
                        true;


                    sendOtpButton.textContent =
                        "Email Verified ✓";


                    // Enable enquiry button
                    submitEnquiryButton.disabled =
                        false;


                    submitEnquiryButton.textContent =
                        "Send Enquiry";


                } else {

                    verificationMessage.textContent =
                        result.message ||
                        "Invalid OTP.";

                    verificationMessage.style.color =
                        "red";


                    verifyOtpButton.disabled =
                        false;

                    verifyOtpButton.textContent =
                        "Verify OTP";

                }


            } catch (error) {

                console.error(error);


                alert(
                    "Unable to connect to the email verification server."
                );


                verifyOtpButton.disabled =
                    false;

                verifyOtpButton.textContent =
                    "Verify OTP";

            }

        }
    );

}


// =====================================================
// PREVENT ENQUIRY WITHOUT EMAIL VERIFICATION
// =====================================================

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Make sure email is verified
            if (
                !emailInput.readOnly
            ) {

                alert(
                    "Please verify your email address before submitting the enquiry."
                );

                return;

            }


            const submitButton =
                submitEnquiryButton;


            submitButton.disabled =
                true;

            submitButton.textContent =
                "Sending...";


            const formData =
                new FormData(contactForm);


            try {

                const response =
                    await fetch(
                        contactForm.action,
                        {
                            method: "POST",

                            body: formData,

                            headers: {
                                "Accept":
                                    "application/json"
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
                                Your email has been verified
                                and your enquiry has been
                                submitted successfully.
                            </p>

                            <p>
                                Our team will contact you shortly.
                            </p>

                            <button
                                type="button"
                                class="primary-button"
                                onclick="location.reload()"
                            >
                                Send Another Enquiry
                            </button>

                        </div>

                    `;

                } else {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Enquiry";


                    alert(
                        "Something went wrong. Please try again."
                    );

                }


            } catch (error) {

                console.error(error);


                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Send Enquiry";


                alert(
                    "Unable to submit the enquiry. Please check your internet connection."
                );

            }

        }
    );

}