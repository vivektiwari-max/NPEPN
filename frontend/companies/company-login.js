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

        form.addEventListener("submit", async (event) => {

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


                    try {
                const response = await fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: passwordValue }),
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("npepn_token", data.token);
                    localStorage.setItem("npepn_user", JSON.stringify(data.user));
                    alert("Login successful! Redirecting...");
                    window.location.href = "company-dashboard.html";
                } else {
                    alert(data.error.message || "Login failed.");
                }
            } catch (error) {
                alert("Server error. Please try again later.");
            }



            console.log("Company login form validated.");

        });

    }

});