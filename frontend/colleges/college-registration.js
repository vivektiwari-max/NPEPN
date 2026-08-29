document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("collegeRegistrationForm");

    if (!form) return;

    const mobileInput = document.getElementById("officialMobile");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Allow only numbers in mobile field
    mobileInput.addEventListener("input", () => {
        mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const mobile = mobileInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Mobile validation
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            mobileInput.focus();
            return;
        }

        // Password length
        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            passwordInput.focus();
            return;
        }

        // Password match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            confirmPasswordInput.focus();
            return;
        }

        // Final frontend confirmation
        alert(
            "Registration form validated successfully.\n\n" +
            "Backend verification will be connected later."
        );

        console.log("College registration data is ready for API integration.");
    });
});