document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("dpcRegistrationForm");

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const mobile = document.getElementById("officialMobile");
    const officerMobile = document.getElementById("officerMobile");
    const pincode = document.getElementById("pincode");

    const authorizationDocument =
        document.getElementById("authorizationDocument");

    const officerIdDocument =
        document.getElementById("officerIdDocument");

    const additionalDocument =
        document.getElementById("additionalDocument");


    /* =========================================
       ONLY NUMBERS
    ========================================== */

    function numbersOnly(input, maxLength) {

        if (!input) return;

        input.addEventListener("input", () => {

            input.value = input.value.replace(/\D/g, "");

            if (input.value.length > maxLength) {
                input.value = input.value.slice(0, maxLength);
            }

        });

    }


    numbersOnly(mobile, 10);
    numbersOnly(officerMobile, 10);
    numbersOnly(pincode, 6);


    /* =========================================
       FILE VALIDATION
       MAXIMUM 5 MB
    ========================================== */

    function validateFile(input) {

        if (!input || !input.files.length) {
            return true;
        }

        const file = input.files[0];

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {

            alert(
                `${file.name} is larger than 5 MB. Please select a smaller file.`
            );

            input.value = "";

            return false;
        }

        return true;

    }


    if (authorizationDocument) {

        authorizationDocument.addEventListener("change", () => {
            validateFile(authorizationDocument);
        });

    }


    if (officerIdDocument) {

        officerIdDocument.addEventListener("change", () => {
            validateFile(officerIdDocument);
        });

    }


    if (additionalDocument) {

        additionalDocument.addEventListener("change", () => {
            validateFile(additionalDocument);
        });

    }


    /* =========================================
       PASSWORD MATCH
    ========================================== */

    function checkPassword() {

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


    password.addEventListener("input", checkPassword);
    confirmPassword.addEventListener("input", checkPassword);


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


            /* DPC mobile */

            if (mobile.value.length !== 10) {

                alert(
                    "Please enter a valid 10-digit official mobile number."
                );

                mobile.focus();

                return;

            }


            /* Officer mobile */

            if (officerMobile.value.length !== 10) {

                alert(
                    "Please enter a valid 10-digit officer mobile number."
                );

                officerMobile.focus();

                return;

            }


            /* PIN */

            if (pincode.value.length !== 6) {

                alert(
                    "Please enter a valid 6-digit PIN code."
                );

                pincode.focus();

                return;

            }


            /* Password */

            if (password.value.length < 8) {

                alert(
                    "Password must contain at least 8 characters."
                );

                password.focus();

                return;

            }


            /* Confirm Password */

            if (password.value !== confirmPassword.value) {

                alert(
                    "Password and Confirm Password do not match."
                );

                confirmPassword.focus();

                return;

            }


            /* Files */

            if (!validateFile(authorizationDocument)) {
                return;
            }

            if (!validateFile(officerIdDocument)) {
                return;
            }

            if (!validateFile(additionalDocument)) {
                return;
            }


            /* =================================
               TEMPORARY FRONTEND SUBMISSION
            ================================= */

            alert(
                "DPC registration submitted successfully!\n\n" +
                "Your registration will be verified by NPEPN before account activation."
            );


            console.log(
                "DPC registration form validated successfully."
            );


            /*
             * BACKEND WILL BE CONNECTED LATER
             *
             * 1. Send DPC details to API.
             * 2. Store registration in PostgreSQL.
             * 3. Upload verification documents.
             * 4. Create account with PENDING status.
             * 5. NPEPN/Admin verifies DPC.
             * 6. APPROVED DPC gets dashboard access.
             */

        });

    }

});