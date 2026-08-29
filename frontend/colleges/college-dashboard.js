document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    /* =========================================
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }
    }


    /* =========================================
       MOBILE MENU BUTTON
    ========================================== */

    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.className = "mobile-menu-button";
    menuButton.innerHTML = "☰";
    menuButton.setAttribute("aria-label", "Open menu");

    document.querySelector(".top-header").prepend(menuButton);

    menuButton.addEventListener("click", () => {
        openSidebar();
    });


    /* =========================================
       CLOSE SIDEBAR ON OVERLAY
    ========================================== */

    if (overlay) {
        overlay.addEventListener("click", () => {
            closeSidebar();
        });
    }


    /* =========================================
       CLOSE SIDEBAR AFTER MENU CLICK
    ========================================== */

    const menuItems = document.querySelectorAll(".menu-item");

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

        });

    });


    /* =========================================
       NOTIFICATION BUTTON
    ========================================== */

    const notificationButton =
        document.querySelector(".notification-button");

    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            alert("No new notifications.");

        });

    }


    /* =========================================
       EDIT PROFILE
    ========================================== */

    const editProfileButton =
        document.querySelector(".edit-profile-btn");

    if (editProfileButton) {

        editProfileButton.addEventListener("click", () => {

            alert(
                "College profile editing will be connected with the backend later."
            );

        });

    }


    /* =========================================
       UPDATE PROFILE BUTTON
    ========================================== */

    const updateProfileButton =
        document.querySelector(".profile-completion button");

    if (updateProfileButton) {

        updateProfileButton.addEventListener("click", () => {

            alert(
                "College profile setup will be available here."
            );

        });

    }


    /* =========================================
       USER PROFILE
    ========================================== */

    const collegeUser =
        document.querySelector(".college-user");

    if (collegeUser) {

        collegeUser.addEventListener("click", () => {

            alert(
                "College account menu will be available here."
            );

        });

    }


    /* =========================================
       RESPONSIVE SIDEBAR
    ========================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 800) {
            closeSidebar();
        }

    });

});