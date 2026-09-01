document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("collegeRegistrationForm");

  if (!form) return;

  const mobileInput = document.getElementById("officialMobile");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Allow only numbers in mobile field
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mobile = mobileInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      mobileInput.focus();
      return;
    }

    // Password length
    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      passwordInput.focus();
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      confirmPasswordInput.focus();
      return;
    }
    const formData = {
      institution_name: document.getElementById("collegeName").value.trim(),
      university: document.getElementById("university").value.trim(),
      institutionType: document.getElementById("institutionType").value,
      affiliation: document.getElementById("affiliation").value.trim(),
      authorizedPerson: document.getElementById("authorizedName").value.trim(),
      email: document.getElementById("officialEmail").value.trim(),
      mobile: mobile,
      address: document.getElementById("address").value.trim(),
      website: document.getElementById("website").value.trim(),
      password: password,
      college_id: document.getElementById("collegeCode").value.trim(),
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/colleges/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error?.message || "College registration failed.");
        return;
      }
      alert(data.message);
      form.reset();
    } catch (error) {
      console.error("College registration error:", error);
      alert("Unable to connect to the server. Please try again");
    }
  });
});
