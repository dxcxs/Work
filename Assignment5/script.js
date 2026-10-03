document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const phone = document.getElementById("phone");
  const toggleBtn = document.getElementById("togglePassword");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const successMessage = document.getElementById("successMessage");

  // ---------- helpers ----------
  function setError(input, message) {
    document.getElementById(input.id + "Error").textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.classList.toggle("valid", message === "");
    return message === "";
  }

  // ---------- validators (return true if valid) ----------
  function validateName() {
    return setError(fullName, fullName.value.trim() === "" ? "Full name cannot be empty." : "");
  }

  function validateEmail() {
    const value = email.value.trim();
    const ok = value.includes("@") && value.includes(".");
    return setError(email, ok ? "" : "Email must contain '@' and '.'.");
  }

  function validatePassword() {
    const ok = password.value.length >= 8;
    return setError(password, ok ? "" : "Password must be at least 8 characters.");
  }

  function validateConfirm() {
    const ok = confirmPassword.value !== "" && confirmPassword.value === password.value;
    return setError(confirmPassword, ok ? "" : "Passwords do not match.");
  }

  function validatePhone() {
    const ok = /^\d{10}$/.test(phone.value);
    return setError(phone, ok ? "" : "Phone must be numbers only, exactly 10 digits.");
  }

  // ---------- password strength meter ----------
  function updateStrength() {
    const value = password.value;
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (value === "") {
      strengthBar.style.width = "0";
      strengthText.textContent = "";
      return;
    }

    const levels = [
      { width: "25%", color: "#d93025", label: "Weak" },
      { width: "25%", color: "#d93025", label: "Weak" },
      { width: "60%", color: "#f4b400", label: "Medium" },
      { width: "85%", color: "#1e9e4a", label: "Strong" },
      { width: "100%", color: "#1e9e4a", label: "Very strong" }
    ];
    const level = levels[score];
    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthText.textContent = "Strength: " + level.label;
  }

  // ---------- events ----------
  fullName.addEventListener("input", validateName);
  email.addEventListener("input", validateEmail);

  password.addEventListener("input", () => {
    updateStrength();
    validatePassword();
    if (confirmPassword.value !== "") validateConfirm();
  });

  confirmPassword.addEventListener("input", validateConfirm);

  phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/\D/g, ""); // block non-digits as typed
    validatePhone();
  });

  toggleBtn.addEventListener("click", () => {
    const hidden = password.type === "password";
    password.type = hidden ? "text" : "password";
    confirmPassword.type = password.type;
    toggleBtn.textContent = hidden ? "🙈" : "👁️";
    toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // stop page reload

    // run all validators (no short-circuit so every error shows)
    const results = [
      validateName(),
      validateEmail(),
      validatePassword(),
      validateConfirm(),
      validatePhone()
    ];

    if (results.every(Boolean)) {
      successMessage.textContent = "✅ Registration successful! Welcome, " + fullName.value.trim() + ".";
      successMessage.classList.remove("hidden");
      form.reset();
      [fullName, email, password, confirmPassword, phone].forEach((el) => el.classList.remove("valid", "invalid"));
      updateStrength();
    } else {
      successMessage.classList.add("hidden");
    }
  });
});
