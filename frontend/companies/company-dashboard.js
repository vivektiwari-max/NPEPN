document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    const notificationButton =
        document.getElementById("notificationButton");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const createDriveBtn =
        document.getElementById("createDriveBtn");

    const emptyCreateDriveBtn =
        document.getElementById("emptyCreateDriveBtn");

    const profileAction =
        document.getElementById("profileAction");

    const driveAction =
        document.getElementById("driveAction");

    const applicationsAction =
        document.getElementById("applicationsAction");


    /* =========================================
       MOBILE MENU BUTTON
    ========================================== */

    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.className = "mobile-menu-button";
    menuButton.innerHTML = "☰";
    menuButton.setAttribute(
        "aria-label",
        "Open company menu"
    );

    const headerLeft =
        document.querySelector(".header-left");

    if (headerLeft) {
        headerLeft.prepend(menuButton);
    }


    /* =========================================
       OPEN SIDEBAR
    ========================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

    }


    /* =========================================
       CLOSE SIDEBAR
    ========================================== */

    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =========================================
       SIDEBAR MENU
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

            if (window.innerWidth <= 800) {
                closeSidebar();
            }

            const sectionName =
                item.querySelector("span:last-child");

            if (sectionName) {

                const name =
                    sectionName.textContent.trim();

                if (name !== "Dashboard") {

                    alert(
                        `${name} section will be connected later.`
                    );

                }

            }

        });

    });


    /* =========================================
       NOTIFICATIONS
    ========================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "You have no new notifications."
                );

            }
        );

    }


    /* =========================================
       CREATE PLACEMENT DRIVE
    ========================================== */

    function createPlacementDrive() {

        alert(
            "Placement Drive creation will be available here.\n\n" +
            "The form will be connected with the backend later."
        );

    }


    if (createDriveBtn) {

        createDriveBtn.addEventListener(
            "click",
            createPlacementDrive
        );

    }


    if (emptyCreateDriveBtn) {

        emptyCreateDriveBtn.addEventListener(
            "click",
            createPlacementDrive
        );

    }


    if (driveAction) {

        driveAction.addEventListener(
            "click",
            createPlacementDrive
        );

    }


    /* =========================================
       COMPANY PROFILE
    ========================================== */

    if (profileAction) {

        profileAction.addEventListener(
            "click",
            () => {

                alert(
                    "Company Profile will be available here.\n\n" +
                    "You will be able to update company information."
                );

            }
        );

    }


    /* =========================================
       STUDENT APPLICATIONS
    ========================================== */

    if (applicationsAction) {

        applicationsAction.addEventListener(
            "click",
            () => {

                alert(
                    "Student Applications will appear here.\n\n" +
                    "Companies will be able to review, shortlist and manage applicants."
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


                /*
                 * Backend authentication/logout
                 * will be connected later.
                 */

                window.location.href =
                    "company-login.html";

            }
        );

    }


    /* =========================================
       RESPONSIVE SIDEBAR
    ========================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 800) {
                closeSidebar();
            }

        }
    );

});