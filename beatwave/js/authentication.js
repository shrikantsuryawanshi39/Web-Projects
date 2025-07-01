// document.querySelector('.next-button').addEventListener('click', function () {
//     const email = document.getElementById('email').value;
//     if (email) {
//         alert('Email: ' + email);
//     } else {
//         alert('Please enter your email address.');
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log(user); // this will print username, email and password in console

    if (user && user.username) {
        const nameElem = document.getElementsByClassName("user_name");
        if (nameElem.length > 0) {
            nameElem[0].textContent = user.username;
            document.getElementById("profile-name").textContent = "Username : " + user.username;
            document.getElementById("profile-email").textContent = "Email : " + user.email;
            document.getElementById("profile-msg").style.display = "none";

            document.getElementById("buttons").style.display = "none";
            return;

        }
    }
    document.getElementById("profile-name").style.display = "none";
    document.getElementById("profile-email").style.display = "none";
    document.getElementById("logout-btn-cont").style.display = "none";
    document.getElementById("profile-msg").style.display = "block";
    document.getElementById("buttons").style.display = "block";
});



function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const messageBox = document.getElementById("form-message");

    if (!username || !email || !password) {
        messageBox.textContent = "All fields are required!";
        messageBox.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(user => user.email === email)) {
        messageBox.textContent = "Email already exists!";
        messageBox.style.color = "red";
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    messageBox.textContent = "Signup successful! You can now log in.";
    messageBox.style.color = "lightgreen";

    setTimeout(() => {
        window.location.href = "/login/login.html";
    }, 1000);
}

// let nextBtn = document.getElementsByClassName("next-button");

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageBox = document.getElementById("form-message");

    if (!email || !password) {
        messageBox.textContent = "All fields are required!";
        messageBox.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        messageBox.textContent = "Invalid email or password!";
        messageBox.style.color = "red";
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // ✅ Redirect to homepage
    messageBox.textContent = "Logged in successfully!";
    messageBox.style.color = "lightgreen";

    // sendind user detail for displaying

    // Add a small delay to showProfile the message before redirecting
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 1000);
    showProfileUserInhome(user);
}


function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const messageBox = document.getElementById("form-message");

    if (user) {
        // document.getElementById("user-name").textContent = user.username;
        // document.getElementById("form-title").textContent = "Dashboard";
        messageBox.textContent = "Logged in successfully";
        messageBox.style.color = "lightgreen";
        return;
    } else {
        messageBox.textContent = "Invalid email or password!";
        messageBox.style.color = "red";
        return;
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 1000);
    // localStorage.removeItem("users"); // delete account
}


function showProfileUserInhome(userDetails) {
    let userName = userDetails.username;
    let nameElem = document.getElementsByClassName("user_name");

    if (nameElem.length > 0) {
        nameElem[0].innerHTML = userName;
        console.log("Logged in as: " + userName);
    } else {
        console.log("Element with class 'user_name' not found");
    }
}

const profileBtn = document.getElementById("user-profile-circle");
profileBtn.addEventListener("click", openCloseProfile);

let showProfile = false;
function openCloseProfile() {
    const profileCard = document.getElementById("profile-open");
    
    if (showProfile === false) {
        profileCard.style.display = "flex"; 
        showProfile = true; 
    } else if (showProfile === true) {
        profileCard.style.display = "none";
        showProfile = false;
    }
   
}