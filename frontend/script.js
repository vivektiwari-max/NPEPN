const studentForm = document.getElementById("studentForm");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;

studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const degree = document.getElementById("degree").value;
    const college = document.getElementById("college").value.trim();
    const district = document.getElementById("district").value;
    const skills = document.getElementById("skills").value.trim();

    // Validation
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (degree === "") {
        alert("Please select your degree.");
        return;
    }

    if (college === "") {
        alert("Please enter your college name.");
        return;
    }

    if (district === "") {
        alert("Please select your district.");
        return;
    }

    if (skills === "") {
        alert("Please enter your skills.");
        return;
    }

    // Student data
    const studentData = {
        name,
        email,
        phone,
        degree,
        college,
        district,
        skills
    };

    try {
        // Send data to backend
        const response = await fetch("http://localhost:3000/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();

        console.log("Backend Response:", data);

        if (response.ok) {
            alert("Student registered successfully!");
            studentForm.reset();
        } else {
            alert(data.message || "Registration failed!");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Backend server se connection nahi ho pa raha!");
    }
});