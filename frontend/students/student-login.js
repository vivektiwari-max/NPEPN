console.log("Student login.js loaded");
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (email === "") {
      alert("Please enter your email.");
      return;
    }

    if (password === "") {
      alert("Please enter your password.");
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        alert(data.error?.message || "Login failed.");
        return;
      }

      if (!data.user || data.user.role !== "student") {
        alert("This account is not a student account.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(data.message || "Student login successful");
      window.location.href = "student-dashboard.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Server connection failed.");
    }
  });
}
