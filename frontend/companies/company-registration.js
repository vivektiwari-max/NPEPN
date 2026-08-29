document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("companyRegistrationForm");

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const togglePassword = document.getElementById("togglePassword");

    const mobile = document.getElementById("officialMobile");
    const pincode = document.getElementById("pincode");

    const companyDocument = document.getElementById("companyDocument");
    const authorizationDocument =
        document.getElementById("authorizationDocument");


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";
                togglePassword.textContent = "Hide";

            } else {

                password.type = "password";
                togglePassword.textContent = "Show";

            }

        });

    }


    /* =========================================
       MOBILE NUMBER
    ========================================== */

    if (mobile) {

        mobile.addEventListener("input", () => {

            mobile.value = mobile.value.replace(/\D/g, "");

            if (mobile.value.length > 10) {
                mobile.value = mobile.value.slice(0, 10);
            }

        });

    }


    /* =========================================
       PINCODE
    ========================================== */

    if (pincode) {

        pincode.addEventListener("input", () => {

            pincode.value = pincode.value.replace(/\D/g, "");

            if (pincode.value.length > 6) {
                pincode.value = pincode.value.slice(0, 6);
            }

        });

    }


    /* =========================================
       FILE SIZE VALIDATION
       Maximum 5 MB
    ========================================== */

    function validateFile(fileInput) {

        if (!fileInput || !fileInput.files.length) {
            return true;
        }

        const file = fileInput.files[0];

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {

            alert(
                `${file.name} is larger than 5 MB. Please choose a smaller file.`
            );

            fileInput.value = "";

            return false;
        }

        return true;
    }


    if (companyDocument) {

        companyDocument.addEventListener("change", () => {
            validateFile(companyDocument);
        });

    }


    if (authorizationDocument) {

        authorizationDocument.addEventListener("change", () => {
            validateFile(authorizationDocument);
        });

    }


    /* =========================================
       PASSWORD MATCH
    ========================================== */

    function checkPasswordMatch() {

        if (
            confirmPassword.value &&
            password.value !== confirmPassword.value
        ) {

            confirmPassword.setCustomValidity(
                "Passwords do not match."
            );

        } else {

            confirmPassword.setCustomValidity("");

        }

    }


    password.addEventListener("input", checkPasswordMatch);
    confirmPassword.addEventListener("input", checkPasswordMatch);


    /* =========================================
       FORM SUBMIT
    ========================================== */

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();


            /* Browser validation */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;
            }


            /* Mobile validation */

            if (mobile.value.length !== 10) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                mobile.focus();

                return;
            }


            /* PIN validation */

            if (pincode.value.length !== 6) {

                alert(
                    "Please enter a valid 6-digit PIN code."
                );

                pincode.focus();

                return;
            }


            /* Password validation */

            if (password.value.length < 8) {

                alert(
                    "Password must contain at least 8 characters."
                );

                password.focus();

                return;
            }


            /* Password confirmation */

            if (password.value !== confirmPassword.value) {

                alert(
                    "Password and Confirm Password do not match."
                );

                confirmPassword.focus();

                return;
            }


            /* File validation */

            if (!validateFile(companyDocument)) {
                return;
            }

            if (!validateFile(authorizationDocument)) {
                return;
            }


            /* =================================
               TEMPORARY FRONTEND SUCCESS
            ================================= */

            alert(
                "Company registration form submitted successfully!\n\n" +
                "Your application will be reviewed by NPEPN."
            );


            /*
             * Backend/API will be connected here later.
             *
             * Later:
             * 1. Send company information to PostgreSQL backend.
             * 2. Upload verification documents.
             * 3. Create pending company account.
             * 4. Admin verifies company.
             * 5. Company login becomes active.
             */


            console.log(
                "Company registration validated successfully."
            );

        });

    }

});