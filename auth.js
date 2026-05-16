function signup() {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const email = emailInput ? emailInput.value.trim() : "";

    if (!username || !password || (emailInput && !email)) {
        alert("Please fill out all fields.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert("Username is already taken.");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! 🚀");
    window.location.href = "signin.html";
}

function signin() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!user) {
        alert("Invalid username or password ❌");
        return;
    }

    localStorage.setItem("loggedInUser", user.username);
    window.location.href = "index.html";
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to sign out?");
    if (confirmLogout) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "signin.html";
    }
}