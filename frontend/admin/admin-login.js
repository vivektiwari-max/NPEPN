document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("adminLoginForm");
    const errorMsg = document.getElementById("errorMsg");
    const loginBtn = document.getElementById("loginBtn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            errorMsg.style.display = "none";
            
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            loginBtn.innerText = "Authenticating...";
            loginBtn.disabled = true;

            try {
                const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.user && data.user.role === 'admin') {
                    // Save Token for Admin
                    localStorage.setItem("adminToken", data.token);
                    localStorage.setItem("adminData", JSON.stringify(data.user));
                    
                    alert("Admin Login Successful!");
                    window.location.href = "admin-dashboard.html";
                } else if (response.ok && data.user.role !== 'admin') {
                    errorMsg.innerText = "Access Denied: Not an Admin Account.";
                    errorMsg.style.display = "block";
                } else {
                    errorMsg.innerText = data.error?.message || data.message || "Invalid email or password.";
                    errorMsg.style.display = "block";
                }
            } catch (error) {
                console.error(error);
                errorMsg.innerText = "Cannot connect to server.";
                errorMsg.style.display = "block";
            } finally {
                loginBtn.innerText = "Secure Log In";
                loginBtn.disabled = false;
            }
        });
    }
});
