const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

// Protect dashboard
if (!token || !user) {
    window.location.href = "student-login.html";
}

// Load student profile
async function loadStudentProfile() {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/students/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load profile.");
        }

        const student = data.student;

        // Top bar
        const topName = document.getElementById("topStudentName");
        if (topName) topName.textContent = student.name;

        // Profile banner
        const bName = document.getElementById("bannerStudentName");
        if (bName) bName.textContent = student.name;

        const bEmail = document.getElementById("bannerStudentEmail");
        if (bEmail) bEmail.textContent = student.email;

        const bPhone = document.getElementById("bannerStudentPhone");
        if (bPhone) bPhone.textContent = student.phone;

        const bDegree = document.getElementById("bannerStudentDegree");
        if (bDegree) bDegree.textContent = student.degree;

        const bCollege = document.getElementById("bannerStudentCollege");
        if (bCollege) bCollege.textContent = student.college;

        const bDistrict = document.getElementById("bannerStudentDistrict");
        if (bDistrict) bDistrict.textContent = student.district;

        // Profile overview
        const oName = document.getElementById("overviewName");
        if (oName) oName.textContent = student.name;

        const oEmail = document.getElementById("overviewEmail");
        if (oEmail) oEmail.textContent = student.email;

        const oPhone = document.getElementById("overviewPhone");
        if (oPhone) oPhone.textContent = student.phone;

        const oDegree = document.getElementById("overviewDegree");
        if (oDegree) oDegree.textContent = student.degree;

        const oCollege = document.getElementById("overviewCollege");
        if (oCollege) oCollege.textContent = student.college;

        const oDistrict = document.getElementById("overviewDistrict");
        if (oDistrict) oDistrict.textContent = student.district;

        // Skills
        const skillsContainer = document.getElementById("overviewSkills");
        if (skillsContainer && student.skills) {
            skillsContainer.innerHTML = "";
            const skillsArr = student.skills.split(",").map(s => s.trim()).filter(Boolean);
            skillsArr.forEach(skill => {
                const badge = document.createElement("span");
                badge.className = "skill-badge";
                badge.textContent = skill;
                skillsContainer.appendChild(badge);
            });
        }

        console.log("Student profile loaded:", student);

    } catch (error) {
        console.error("Profile loading error:", error.message);
    }
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "student-login.html";
    });
}

// Mobile sidebar toggle
const menuButton = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("studentSidebar");
const overlay = document.getElementById("sidebarOverlay");

if (menuButton && sidebar && overlay) {
    menuButton.addEventListener("click", function () {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
}

// Start loading profile
loadStudentProfile();
