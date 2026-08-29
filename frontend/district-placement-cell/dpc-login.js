document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("dpcLoginForm");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const forgotPassword =
        document.getElementById("forgotPassword");


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";

                togglePassword.textContent = "Hide";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                password.type = "password";

                togglePassword.textContent = "Show";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =========================================
       FORGOT PASSWORD
    ========================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener("click", (event) => {

            event.preventDefault();

            alert(
                "Password recovery will be connected with the NPEPN backend later."
            );

        });

    }


    /* =========================================
       LOGIN
    ========================================== */

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();


            /* Browser validation */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            const emailValue =
                email.value.trim();

            const passwordValue =
                password.value;


            /* Email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(emailValue)) {

                alert(
                    "Please enter a valid official email address."
                );

                email.focus();

                return;

            }


            /* Password validation */

            if (passwordValue.length < 8) {

                alert(
                    "Password must contain at least 8 characters."
                );

                password.focus();

                return;

            }


            /*
             * TEMPORARY FRONTEND LOGIN
             *
             * Real authentication will be connected
             * with PostgreSQL + backend API later.
             */

            alert(
                "Login successful (frontend demo).\n\n" +
                "Backend authentication will be connected later."
            );


            /*
             * Temporary dashboard redirect
             */

            window.location.href =
                "dpc-dashboard.html";

        });

    }

});