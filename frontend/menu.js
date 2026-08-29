document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenu = document.getElementById("closeMenu");
    const overlay = document.getElementById("overlay");

    // OPEN MENU
    menuBtn.addEventListener("click", function () {
        sideMenu.classList.add("active");
        overlay.classList.add("active");
    });

    // CLOSE MENU
    closeMenu.addEventListener("click", function () {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    // CLOSE WHEN CLICKING OUTSIDE
    overlay.addEventListener("click", function () {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });


    // DROPDOWN
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(function (dropdown) {

        const title = dropdown.querySelector(".dropdown-title");

        title.addEventListener("click", function () {

            dropdown.classList.toggle("open");

        });

    });

});