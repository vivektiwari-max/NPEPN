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
        togglePassword.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
        togglePassword.setAttribute("aria-label", "Show password");
      }
    });
  }

  /* =========================================
       LOGIN FORM
    ========================================= */

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("officialEmail");

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

      /* Login data */

      const loginData = {
        email: email,
        password: password,
      };

      try {
        /* Send login request to backend */

        const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        });

        /* Convert response into JSON */

        const data = await response.json();

        console.log("College Login Response:", data);

        /* Login failed */

        if (!response.ok) {
          alert(data.error?.message || "Login failed.");
          return;
        }

        /* Check college role */

        if (!data.user || data.user.role !== "college") {
          alert("This account is not a college account.");
          return;
        }

        /* Save login information */

        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        /* Login successful */

        alert(data.message);

        console.log("College login successful");

        /* Open college dashboard */

        window.location.href = "college-dashboard.html";
      } catch (error) {
        console.error("College login error:", error);

        alert("Unable to connect to the server. Please try again.");
      }
    });
  }

  /* =========================================
       FORGOT PASSWORD
    ========================================= */

  if (forgotPassword) {
    forgotPassword.addEventListener("click", (event) => {
      event.preventDefault();

      alert(
        "Password recovery will be available after backend authentication is connected.",
      );
    });
  }
});
