document.addEventListener('DOMContentLoaded', function() {
    // ---------------- UI TOGGLE LOGIC ----------------
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    // NEW: Get the logout button
    const logoutBtn = document.getElementById('logoutBtn');
    
    const goLogin = document.getElementById('goLogin');
    const goSignup = document.getElementById('goSignup');
    
    const goForgot = document.getElementById('goForgot'); 
    const goLoginFromForgot = document.getElementById('goLoginFromForgot');

    const homeSection = document.getElementById('home-section');
    const loginFormContainer = document.getElementById('login-form'); 
    const signupFormContainer = document.getElementById('signup-form'); 
    const forgotFormContainer = document.getElementById('forgot-form'); 

    const loginForm = document.getElementById('loginForm'); 
    const signupForm = document.getElementById('signupForm'); 
    const forgotForm = document.getElementById('forgotForm'); 

    const allFormsContainers = [loginFormContainer, signupFormContainer, forgotFormContainer];

    function updateNavbarButtons(isLoggedIn) {
        if (isLoggedIn) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }

    function showSection(sectionToShow) {
        // Hide all sections first
        homeSection.classList.add('hidden');
        allFormsContainers.forEach(form => form.classList.add('hidden'));

        // Show the requested section
        sectionToShow.classList.remove('hidden');

        // Check login status and update buttons every time section changes
        const currentUser = localStorage.getItem("currentUser");
        updateNavbarButtons(!!currentUser && sectionToShow === homeSection); 
    }

    // NEW: Logout Functionality
    function handleLogout() {
        localStorage.removeItem("currentUser");
        alert("Logged out successfully.");
        showSection(loginFormContainer); // Redirect to login page
    }
    
    // Check for existing session on load
    if (localStorage.getItem("currentUser")) {
        showSection(homeSection);
    } else {
        showSection(loginFormContainer); 
    }

    // NEW: Attach Logout listener
    logoutBtn.addEventListener('click', handleLogout);

    // Toggling from Navbar
    loginBtn.addEventListener('click', () => showSection(loginFormContainer));
    signupBtn.addEventListener('click', () => showSection(signupFormContainer));

    // Toggling between forms (inside the forms)
    goLogin.addEventListener('click', () => showSection(loginFormContainer));
    goSignup.addEventListener('click', () => showSection(signupFormContainer));
    
    // Forgot Password Toggles
    goForgot.addEventListener('click', () => showSection(forgotFormContainer));
    goLoginFromForgot.addEventListener('click', () => showSection(loginFormContainer));


    // ---------------- PASSWORD TOGGLE LOGIC ----------------
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash'); 
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    // ---------------- END PASSWORD TOGGLE LOGIC ----------------


    // ---------------- ENCRYPT FUNCTION ----------------
    function encrypt(data) {
        return btoa(data); // Base64 encoding
    }

    // ---------------- REGEX VALIDATION FUNCTIONS ----------------
    function validateName(name) {
        return /^[A-Za-z ]{3,}$/.test(name);
    }

    function validateEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
    }

    function validateMobile(mobile) {
        return /^[6-9]\d{9}$/.test(mobile);
    }

    function validatePassword(password) {
        // 8+ chars, 1 upper, 1 lower, 1 number, 1 symbol
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    // ---------------- UTILITY: REALTIME VALIDATION ----------------
    function attachRealtimeValidation(inputId, errorId, validationFn, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);

        if (!input) return;

        input.addEventListener("input", () => {
            const value = input.value.trim();

            if (value === "") {
                error.innerText = "";
                input.classList.remove("error-input", "success-input");
                return;
            }

            if (validationFn(value)) {
                error.innerText = "";
                input.classList.remove("error-input");
                input.classList.add("success-input");
            } else {
                error.innerText = message;
                input.classList.remove("success-input");
                input.classList.add("error-input");
            }
        });
    }

    // ---------------- ENABLE REALTIME VALIDATION ----------------
    attachRealtimeValidation("loginEmail", "loginEmailError", validateEmail, 
        "Enter a valid email address.");
    attachRealtimeValidation("loginPassword", "loginPasswordError", validatePassword, 
        "Password must contain 8+ chars, 1 upper, 1 lower, 1 number, 1 symbol.");
    
    attachRealtimeValidation("signupName", "signupNameError", validateName, 
        "Name must contain only letters & be at least 3 characters.");
    attachRealtimeValidation("signupEmail", "signupEmailError", validateEmail, 
        "Enter a valid email address.");
    attachRealtimeValidation("signupMobile", "signupMobileError", validateMobile, 
        "Mobile number must be 10 digits & start with 6–9.");
    attachRealtimeValidation("signupPassword", "signupPasswordError", validatePassword, 
        "Password must contain 8+ chars, 1 upper, 1 lower, 1 number, 1 symbol.");
    
    attachRealtimeValidation("forgotEmail", "forgotEmailError", validateEmail, 
        "Enter a valid email address.");


    // ---------------- LOCAL STORAGE FUNCTIONS ----------------
    function saveUser(userObj) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        // Check if email already exists
        if (users.some(u => u.email === userObj.email)) {
            return false;
        }
        users.push(userObj);
        localStorage.setItem("users", JSON.stringify(users));
        return true;
    }

    function checkLogin(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const encryptedPassword = encrypt(password);
        return users.find(u => u.email === email && u.password === encryptedPassword);
    }
    
    function findUserByEmail(email) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(u => u.email === email);
    }

    // ---------------- SIGNUP SUBMIT ----------------
    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const mobile = document.getElementById("signupMobile").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (
                validateName(name) &&
                validateEmail(email) &&
                validateMobile(mobile) &&
                validatePassword(password)
            ) {
                const userData = {
                    name: encrypt(name),
                    email: email,
                    mobile: mobile,
                    password: encrypt(password)
                };

                if (!saveUser(userData)) {
                    alert("Email already exists! Please login.");
                    showSection(loginFormContainer); 
                    return;
                }

                alert("Signup Successful! Please log in.");
                showSection(loginFormContainer); 

            } else {
                alert("Fix validation errors before submitting.");
            }
        });
    }

    // ---------------- LOGIN SUBMIT ----------------
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (validateEmail(email) && validatePassword(password)) {
                const user = checkLogin(email, password);

                if (user) {
                    alert("Login Successful! Welcome.");
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    showSection(homeSection); 
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                alert("Fix validation errors before submitting.");
            }
        });
    }
    
    // ---------------- FORGOT PASSWORD SUBMIT ----------------
    if (forgotForm) {
        forgotForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("forgotEmail").value.trim();

            if (validateEmail(email)) {
                const user = findUserByEmail(email);

                if (user) {
                    alert(`Reset link sent to ${email}! (Simulated)`);
                    showSection(loginFormContainer); 
                } else {
                    alert("No account found with that email address.");
                }
            } else {
                alert("Please enter a valid email address.");
            }
        });
    }
});