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
       LOGIN (CONNECTED TO BACKEND)
    ========================================== */

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            /* Browser validation */
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const emailValue = email.value.trim();
            const passwordValue = password.value;

            /* Email validation */
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                alert("Please enter a valid official email address.");
                email.focus();
                return;
            }

            /* Password validation */
            if (passwordValue.length < 8) {
                alert("Password must contain at least 8 characters.");
                password.focus();
                return;
            }

            // UI feedback
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Signing in...";
            submitBtn.disabled = true;

            try {
                // Call Backend Login API
                const response = await fetch("http://127.0.0.1:3000/api/dpc/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: emailValue,
                        password: passwordValue
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save Token and DPC Data to localStorage for session
                    localStorage.setItem("dpcToken", data.data.token);
                    localStorage.setItem("dpcData", JSON.stringify(data.data.dpc));

                    alert("Login Successful!");
                    
                    // Redirect to the actual dashboard
                    window.location.href = "dpc-dashboard.html";
                } else {
                    // Invalid credentials
                    alert(data.message || "Invalid email or password.");
                }
            } catch (error) {
                console.error("Login API Error:", error);
                alert("Cannot connect to server. Is the backend running?");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
