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
        password: password
    };


    try {

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)
        });


        const data = await response.json();

        console.log("Login Response:", data);


        if (response.ok) {

            alert(data.message);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Login successful");
           window.location.href = "student-dashboard.html"; 
        } else {

            alert(data.message || "Login failed.");

        }

    } catch (error) {

        console.error("Login error:", error);

        alert("Server connection Failed.");

    }

});