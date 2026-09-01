console.log("Student login.js loaded");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Basic validation

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  if (password === "") {
    alert("Please enter your password.");
    return;
  }

  // Login data

  const loginData = {
    email: email,
    password: password,
  };

  try {
    // Send login request to backend

    const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(loginData),
    });

    // Convert backend response to JSON

    const data = await response.json();

    console.log("Login Response:", data);

    // Login failed

    if (!response.ok) {
      alert(data.error?.message || "Login failed.");
      return;
    }

    // Check student role

    if (!data.user || data.user.role !== "student") {
      alert("This account is not a student account.");
      return;
    }

    // Save login information

    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));

    // Login successful

    alert(data.message);

    console.log("Student login successful");

    // Open student dashboard

    window.location.href = "student-dashboard.html";
  } catch (error) {
    console.error("Login error:", error);

    alert("Server connection failed.");
  }
});
