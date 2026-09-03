document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenu = document.getElementById("closeMenu");
    const overlay = document.getElementById("overlay");

    // OPEN SIDE MENU DRAWER
    if (menuBtn && sideMenu && overlay) {
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            sideMenu.classList.add("active");
            overlay.classList.add("active");
        });
    }

    // CLOSE SIDE MENU DRAWER
    if (closeMenu && sideMenu && overlay) {
        closeMenu.addEventListener("click", function () {
            sideMenu.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // CLOSE WHEN CLICKING OUTSIDE
    if (overlay && sideMenu) {
        overlay.addEventListener("click", function () {
            sideMenu.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // SIDE MENU ACCORDION DROPDOWNS
    const dropdowns = document.querySelectorAll(".side-menu .dropdown");
    dropdowns.forEach(function (dropdown) {
        const title = dropdown.querySelector(".dropdown-title");
        if (title) {
            title.addEventListener("click", function (e) {
                e.stopPropagation();
                dropdown.classList.toggle("open");
            });
        }
    });

    // TOP NAVBAR CLICK TOGGLES (FOR TOUCH & CLICK SUPPORT)
    const authDropdowns = document.querySelectorAll(".auth-dropdown, .nav-dropdown");
    authDropdowns.forEach(function (dropdown) {
        const toggleBtn = dropdown.querySelector(".login-button, .register-button, > a");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Close other open topbar dropdowns
                authDropdowns.forEach(function (other) {
                    if (other !== dropdown) {
                        other.classList.remove("active");
                    }
                });

                dropdown.classList.toggle("active");
            });
        }
    });

    // CLOSE TOP NAVBAR DROPDOWNS WHEN CLICKING ANYWHERE OUTSIDE
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".nav-dropdown") && !e.target.closest(".auth-dropdown")) {
            authDropdowns.forEach(function (dropdown) {
                dropdown.classList.remove("active");
            });
        }
    });

});
