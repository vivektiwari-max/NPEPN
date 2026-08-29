document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("collegeLoginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.querySelector(".forgot-password");

    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================= */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                togglePassword.textContent = "Hide";
                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";
                togglePassword.textContent = "Show";
                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        });

    }


    /* =========================================
       LOGIN FORM
    ========================================= */

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const emailInput =
                document.getElementById("officialEmail");

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            /* Empty email */

            if (!email) {
                alert("Please enter your official email.");
                emailInput.focus();
                return;
            }


            /* Email format */

            if (!emailInput.checkValidity()) {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return;
            }


            /* Empty password */

            if (!password) {
                alert("Please enter your password.");
                passwordInput.focus();
                return;
            }


            /* Temporary frontend response */

            alert(
                "Login form validated successfully.\n\n" +
                "College authentication will be connected with the backend later."
            );

            console.log("College login data is ready for API integration.");

        });

    }


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    if (forgotPassword) {

        forgotPassword.addEventListener("click", (event) => {

            event.preventDefault();

            alert(
                "Password recovery will be available after backend authentication is connected."
            );

        });

    }

});