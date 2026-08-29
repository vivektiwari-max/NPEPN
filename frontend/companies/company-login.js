document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("companyLoginForm");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.getElementById("forgotPassword");


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    if (togglePassword && password) {

        togglePassword.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";
                togglePassword.textContent = "Hide";

            } else {

                password.type = "password";
                togglePassword.textContent = "Show";

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
                "Password reset will be connected with the backend later."
            );

        });

    }


    /* =========================================
       LOGIN
    ========================================== */

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();


            const email = document
                .getElementById("companyEmail")
                .value
                .trim();

            const passwordValue = password.value.trim();


            /* EMAIL */

            if (!email) {

                alert("Please enter your company email.");

                document
                    .getElementById("companyEmail")
                    .focus();

                return;
            }


            /* PASSWORD */

            if (!passwordValue) {

                alert("Please enter your password.");

                password.focus();

                return;
            }


            /* PASSWORD LENGTH */

            if (passwordValue.length < 8) {

                alert(
                    "Password must contain at least 8 characters."
                );

                password.focus();

                return;
            }


            /* =================================
               TEMPORARY FRONTEND LOGIN
            ================================= */

            alert(
                "Login validation successful.\n\n" +
                "Backend authentication will be connected later."
            );


            /*
             * Backend/API will be connected here later.
             *
             * After backend integration:
             *
             * 1. Send email + password to API.
             * 2. Verify company account.
             * 3. Check whether company is approved.
             * 4. Create authentication session/token.
             * 5. Redirect to company dashboard.
             */


            console.log("Company login form validated.");

        });

    }

});