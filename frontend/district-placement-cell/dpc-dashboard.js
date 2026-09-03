document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       SESSION PROTECTION
    ========================================== */
    const dpcToken = localStorage.getItem("dpcToken");
    const dpcDataString = localStorage.getItem("dpcData");

    if (!dpcToken || !dpcDataString) {
        alert("Session Expired or Not Logged In. Please login first.");
        window.location.href = "dpc-login.html";
        return;
    }

    const dpcData = JSON.parse(dpcDataString);

    /* =========================================
       ELEMENTS
    ========================================== */

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");

    const notificationButton =
        document.getElementById("notificationButton");

    const createOpeningBtn =
        document.getElementById("createOpeningBtn");

    const emptyCreateOpeningBtn =
        document.getElementById("emptyCreateOpeningBtn");

    const openingAction =
        document.getElementById("openingAction");

    const applicationAction =
        document.getElementById("applicationAction");

    const examAction =
        document.getElementById("examAction");

    const resultAction =
        document.getElementById("resultAction");


    /* =========================================
       MOBILE SIDEBAR BUTTON
    ========================================== */

    const mobileMenuButton =
        document.createElement("button");

    mobileMenuButton.type = "button";
    mobileMenuButton.className = "mobile-menu-button";
    mobileMenuButton.id = "mobileMenuButton";
    mobileMenuButton.innerHTML = "☰";
    mobileMenuButton.setAttribute(
        "aria-label",
        "Open menu"
    );

    const headerLeft =
        document.querySelector(".header-left");

    if (headerLeft) {

        headerLeft.prepend(mobileMenuButton);

    }


    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

    }


    mobileMenuButton.addEventListener(
        "click",
        openSidebar
    );


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =========================================
       SIDEBAR NAVIGATION
    ========================================== */

    const menuItems =
        document.querySelectorAll(".menu-item");


    menuItems.forEach((item) => {

        item.addEventListener("click", (event) => {

            event.preventDefault();


            menuItems.forEach((menu) => {
                menu.classList.remove("active");
            });


            item.classList.add("active");


            const sectionName =
                item.querySelector("span:last-child")
                    ?.textContent
                    .trim();


            if (sectionName &&
                sectionName !== "Dashboard") {

                alert(
                    `${sectionName} module will be connected next.`
                );

            }


            closeSidebar();

        });

    });


    /* =========================================
       CREATE TRAINING OPENING
    ========================================== */

    function createTrainingOpening() {

        alert(
            "Training Opening module will be developed next.\n\n" +
            "DPC will be able to create and publish training opportunities for eligible students."
        );

    }


    if (createOpeningBtn) {

        createOpeningBtn.addEventListener(
            "click",
            createTrainingOpening
        );

    }


    if (emptyCreateOpeningBtn) {

        emptyCreateOpeningBtn.addEventListener(
            "click",
            createTrainingOpening
        );

    }


    if (openingAction) {

        openingAction.addEventListener(
            "click",
            createTrainingOpening
        );

    }


    /* =========================================
       APPLICATIONS
    ========================================== */

    if (applicationAction) {

        applicationAction.addEventListener(
            "click",
            () => {

                alert(
                    "Applications module will allow DPC officers to review and manage student applications."
                );

            }
        );

    }


    /* =========================================
       EXAMINATIONS
    ========================================== */

    if (examAction) {

        examAction.addEventListener(
            "click",
            () => {

                alert(
                    "Examination module will allow DPC officers to schedule and manage examinations."
                );

            }
        );

    }


    /* =========================================
       RESULTS
    ========================================== */

    if (resultAction) {

        resultAction.addEventListener(
            "click",
            () => {

                alert(
                    "Results module will allow DPC officers to manage and publish examination results."
                );

            }
        );

    }


    /* =========================================
       NOTIFICATIONS
    ========================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "No new notifications."
                );

            }
        );

    }


    /* =========================================
       LOGOUT
    ========================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {
                    return;
                }

                // Remove Token and Data
                localStorage.removeItem("dpcToken");
                localStorage.removeItem("dpcData");




                window.location.href =
                    "dpc-login.html";

            }
        );

    }


    /* =========================================
       DEMO DASHBOARD DATA
    ========================================== */

    const demoData = {

        activeOpenings: 0,

        totalApplications: 0,

        selectedStudents: 0,

        availableSeats: 0

    };


    const activeOpenings =
        document.getElementById("activeOpenings");

    const totalApplications =
        document.getElementById("totalApplications");

    const selectedStudents =
        document.getElementById("selectedStudents");

    const availableSeats =
        document.getElementById("availableSeats");


    if (activeOpenings) {
        activeOpenings.textContent =
            demoData.activeOpenings;
    }

    if (totalApplications) {
        totalApplications.textContent =
            demoData.totalApplications;
    }

    if (selectedStudents) {
        selectedStudents.textContent =
            demoData.selectedStudents;
    }

    if (availableSeats) {
        availableSeats.textContent =
            demoData.availableSeats;
    }


    /* =========================================
       RESPONSIVE CLEANUP
    ========================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 800) {
            closeSidebar();
        }

    });


    console.log(
        "NPEPN DPC Dashboard loaded successfully."
    );

});