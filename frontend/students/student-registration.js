const studentForm = document.getElementById("studentForm");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;

if (studentForm) {
    studentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const degree = document.getElementById("degree").value;
        const college = document.getElementById("college").value.trim();
        const district = document.getElementById("district").value;
        const skills = document.getElementById("skills").value.trim();

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

        if (password === "") {
            alert("Please enter a password.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (confirmPassword === "") {
            alert("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
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

        const studentData = {
            name,
            email,
            phone,
            password,
            degree,
            college,
            district,
            skills
        };

        try {
            const response = await fetch("http://127.0.0.1:3000/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });

            const data = await response.json();
            console.log("Backend Response:", data);

            if (response.ok) {
                alert("Student registered successfully! Redirecting to login...");
                studentForm.reset();
                window.location.href = "student-login.html";
            } else {
                alert(data.error?.message || "Registration failed!");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Backend server connection failed.");
        }
    });
}

// ===============================
// COLLEGE SEARCH
// ===============================

const collegeInput = document.getElementById("college");
const collegeResults = document.getElementById("collegeResults");
const collegeIdInput = document.getElementById("collegeId");

let collegeSearchTimer;

if (collegeInput && collegeResults) {

    collegeInput.addEventListener("input", function () {
        const searchText = collegeInput.value.trim();

        clearTimeout(collegeSearchTimer);

        if (collegeIdInput) collegeIdInput.value = "";

        if (searchText.length < 2) {
            collegeResults.innerHTML = "";
            collegeResults.style.display = "none";
            return;
        }

        collegeSearchTimer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:3000/api/colleges?search=${encodeURIComponent(searchText)}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load colleges.");
                }

                collegeResults.innerHTML = "";

                if (!data.colleges || data.colleges.length === 0) {
                    collegeResults.innerHTML = `
                        <div class="no-college">
                            No college found
                        </div>
                    `;
                } else {
                    data.colleges.forEach(college => {
                        const item = document.createElement("div");
                        item.className = "college-result-item";
                        item.innerHTML = `
                            <strong>${college.college_name}</strong>
                            <small>
                                ${college.city || ""}
                                ${college.district ? ", " + college.district : ""}
                                ${college.state ? ", " + college.state : ""}
                            </small>
                        `;

                        item.addEventListener("click", function () {
                            collegeInput.value = college.college_name;
                            if (collegeIdInput) collegeIdInput.value = college.id;
                            collegeResults.innerHTML = "";
                            collegeResults.style.display = "none";
                        });

                        collegeResults.appendChild(item);
                    });
                }

                collegeResults.style.display = "block";

            } catch (error) {
                console.error("College search error:", error);
                collegeResults.innerHTML = `
                    <div class="no-college">
                        Unable to load colleges
                    </div>
                `;
                collegeResults.style.display = "block";
            }
        }, 300);
    });

    document.addEventListener("click", function (event) {
        if (!collegeInput.contains(event.target) && !collegeResults.contains(event.target)) {
            collegeResults.style.display = "none";
        }
    });
}
