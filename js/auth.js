// REGISTER FUNCTION
function register() {
  var email = document.getElementById("regEmail").value;
  var password = document.getElementById("regPassword").value;

  if (email === "" || password === "") {
    document.getElementById("registerMessage").innerText =
      "Please fill all fields.";
    return;
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);

  document.getElementById("registerMessage").innerText =
    "Registration successful! You can log in now.";
}

// LOGIN FUNCTION
function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  var storedEmail = localStorage.getItem("userEmail");
  var storedPassword = localStorage.getItem("userPassword");

  if (email === storedEmail && password === storedPassword) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    document.getElementById("loginMessage").innerText =
      "Invalid email or password.";
  }
}
