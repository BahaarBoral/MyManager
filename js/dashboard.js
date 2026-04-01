// ===== DASHBOARD — Live Summary JS =====
// Concepts: window.onload, localStorage, for loop, innerText, onmouseover/onmouseout

window.addEventListener("DOMContentLoaded", function () {

    // --- Calculate total expenses ---
    var totalMoney = 0;
    var expData = localStorage.getItem("expenses");
    if (expData) {
        var expenses = JSON.parse(expData);
        for (var i = 0; i < expenses.length; i++) {
            totalMoney = totalMoney + expenses[i].amount;
        }
    }
    document.getElementById("totalMoney").innerText = "Rs. " + totalMoney;

    // --- Calculate total screen time ---
    var totalScreen = 0;
    var timeData = localStorage.getItem("timeLogs");
    if (timeData) {
        var timeLogs = JSON.parse(timeData);
        for (var i = 0; i < timeLogs.length; i++) {
            totalScreen = totalScreen + timeLogs[i].hours;
        }
    }
    totalScreen = Math.round(totalScreen * 10) / 10;
    document.getElementById("totalScreenTime").innerText = totalScreen + " hrs";

    // --- Calculate total pomodoro focus time ---
    var totalPomodoro = 0;
    var pomData = localStorage.getItem("pomodoroSessions");
    if (pomData) {
        var sessions = JSON.parse(pomData);
        for (var i = 0; i < sessions.length; i++) {
            totalPomodoro = totalPomodoro + sessions[i].minutes;
        }
    }
    var pomHours = Math.round((totalPomodoro / 60) * 10) / 10;
    document.getElementById("totalPomodoro").innerText = pomHours + " hrs";

    // --- Personalized greeting ---
    var name = localStorage.getItem("name");
    var greetEl = document.getElementById("greetingName");
    if (greetEl && name && name.trim() !== "") {
        greetEl.innerText = "Welcome Back, " + name + " 🌱";
    }

    // --- onmouseover/onmouseout hover effects on dashboard cards ---
    var cards = document.querySelectorAll(".dashboard-card");
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("mouseover", function () {
            this.style.borderColor = "#34d399";
            this.style.boxShadow = "0 20px 60px rgba(52, 211, 153, 0.25)";
        });
        cards[i].addEventListener("mouseout", function () {
            this.style.borderColor = "#2a3448";
            this.style.boxShadow = "0 15px 40px rgba(0,0,0,0.25)";
        });
    }
});
