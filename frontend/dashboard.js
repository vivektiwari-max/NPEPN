const token = localStorage.getItem("token");
const user = localStorage.getItem("user");


// Protect dashboard
if (!token || !user) {
    window.location.href = "student-login.html";
}


// Load student profile
async function loadStudentProfile() {

    try {

       
        const response = await fetch(
  "http://127.0.0.1:3000/api/students/profile",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load profile.");
        }


        const student = data.student;


        // Top bar
        document.getElementById("welcomeName").textContent =
            `${student.name}!`;

        document.getElementById("topProfileName").textContent =
            student.name;


        // Profile banner
        document.getElementById("studentName").textContent =
            student.name;

        document.getElementById("studentEmail").textContent =
            student.email;

        document.getElementById("studentPhone").textContent =
            student.phone;

        document.getElementById("studentDegree").textContent =
            student.degree;

        document.getElementById("studentCollege").textContent =
            student.college;

        document.getElementById("studentDistrict").textContent =
            student.district;


        // Profile overview
        document.getElementById("overviewName").textContent =
            student.name;

        document.getElementById("overviewEmail").textContent =
            student.email;

        document.getElementById("overviewDegree").textContent =
            student.degree;

        document.getElementById("overviewCollege").textContent =
            student.college;

        document.getElementById("overviewDistrict").textContent =
            student.district;


        console.log("Student profile loaded:", student);

    } catch (error) {

        console.error("Profile loading error:", error.message);

    }
}


// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "student-login.html";

});


// Mobile sidebar
const menuButton = document.getElementById("menuButton");
const sidebar = document.querySelector(".dashboard-sidebar");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("show");

    });

}


// Start
loadStudentProfile();