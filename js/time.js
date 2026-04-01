// ===== TIME SINK — Screen-Time Tracker JS =====
// Concepts: querySelectorAll, checkbox/radio reading, onchange, for loop, Canvas API, localStorage, DOM manipulation

// --- Load time logs from localStorage ---
function getTimeLogs() {
    var data = localStorage.getItem("timeLogs");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

// --- Save time logs to localStorage ---
function saveTimeLogs(logs) {
    localStorage.setItem("timeLogs", JSON.stringify(logs));
}

// --- Get checked checkbox values ---
function getCheckedActivities() {
    var checkboxes = document.querySelectorAll('#activityCheckboxes input[type="checkbox"]');
    var activities = [];

    // for loop through checkboxes
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            activities.push(checkboxes[i].value);
        }
    }
    return activities;
}

// --- Get selected radio button value ---
function getSelectedPeak() {
    var radios = document.querySelectorAll('input[name="peak"]');

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "Not specified";
}

// --- Update insight text dynamically (onchange) ---
function updateInsight() {
    var hoursInput = document.getElementById("screenHours");
    var insightEl = document.getElementById("insightText");
    var hours = parseFloat(hoursInput.value);

    if (isNaN(hours) || hours <= 0) {
        insightEl.innerText = "Enter your screen time to see a personalized insight.";
        return;
    }

    if (hours < 1) {
        insightEl.innerHTML = "<b>Proud of you 💜</b> — Under 1 hour! Keep it up.";
    } else if (hours <= 2) {
        insightEl.innerHTML = "<b>Balanced 🌱</b> — Good control today.";
    } else if (hours <= 3) {
        insightEl.innerHTML = "<b>Hmm 🤔</b> — Starting to add up. Stay mindful.";
    } else {
        insightEl.innerHTML = "<b>Uh-oh 😬</b> — Over 3 hours. Awareness is step one!";
    }
}

// --- Render time log history table ---
function renderTimeLogs() {
    var logs = getTimeLogs();
    var tableBody = document.getElementById("timeTableBody");
    tableBody.innerHTML = "";

    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var row = document.createElement("tr");
        row.innerHTML =
            "<td>" + log.date + "</td>" +
            "<td>" + log.hours + " hrs</td>" +
            "<td>" + log.activities.join(", ") + "</td>" +
            "<td>" + log.peak + "</td>" +
            '<td><button class="delete-btn" onclick="deleteTimeLog(' + i + ')">✕</button></td>';
        tableBody.appendChild(row);
    }

    // Draw chart after rendering table
    drawTimeChart();
}

// --- Save a new time log ---
function saveTimeLog() {
    var hoursInput = document.getElementById("screenHours");
    var messageEl = document.getElementById("timeMessage");
    var hours = parseFloat(hoursInput.value);

    // Validation
    if (isNaN(hours) || hours <= 0) {
        messageEl.innerText = "⚠️ Please enter valid screen time (hours > 0).";
        messageEl.style.color = "#ef4444";
        return;
    }

    var activities = getCheckedActivities();
    if (activities.length === 0) {
        messageEl.innerText = "⚠️ Please select at least one activity.";
        messageEl.style.color = "#ef4444";
        return;
    }

    var peak = getSelectedPeak();

    var logEntry = {
        date: new Date().toLocaleDateString("en-IN"),
        hours: hours,
        activities: activities,
        peak: peak
    };

    var logs = getTimeLogs();
    logs.push(logEntry);
    saveTimeLogs(logs);

    // Reset form
    hoursInput.value = "";
    var checkboxes = document.querySelectorAll('#activityCheckboxes input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
    var radios = document.querySelectorAll('input[name="peak"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }

    messageEl.innerText = "✅ Screen time logged!";
    messageEl.style.color = "#34d399";

    renderTimeLogs();
}

// --- Delete a time log ---
function deleteTimeLog(index) {
    var logs = getTimeLogs();
    logs.splice(index, 1);
    saveTimeLogs(logs);
    renderTimeLogs();
}

// --- Draw horizontal bar chart using Canvas API ---
function drawTimeChart() {
    var canvas = document.getElementById("timeChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var logs = getTimeLogs();

    // Calculate total hours per activity
    var activityTotals = {
        "Studying": 0,
        "Social Media": 0,
        "Entertainment": 0,
        "Shopping": 0
    };

    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var perActivity = log.hours / log.activities.length; // split hours evenly

        for (var j = 0; j < log.activities.length; j++) {
            var act = log.activities[j];
            if (activityTotals.hasOwnProperty(act)) {
                activityTotals[act] = activityTotals[act] + perActivity;
            }
        }
    }

    // Clear canvas
    canvas.width = canvas.width; // reset trick
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var labels = Object.keys(activityTotals);
    var values = [];
    for (var i = 0; i < labels.length; i++) {
        values.push(Math.round(activityTotals[labels[i]] * 10) / 10);
    }

    var maxVal = 0;
    for (var i = 0; i < values.length; i++) {
        if (values[i] > maxVal) maxVal = values[i];
    }
    if (maxVal === 0) maxVal = 1;

    var barColors = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24"];
    var barHeight = 35;
    var gap = 20;
    var startY = 30;
    var maxBarWidth = canvas.width - 160;

    // Title
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 16px Segoe UI, sans-serif";
    ctx.fillText("Hours by Activity", 10, 20);

    for (var i = 0; i < labels.length; i++) {
        var y = startY + i * (barHeight + gap);
        var barWidth = (values[i] / maxVal) * maxBarWidth;

        // Label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Segoe UI, sans-serif";
        ctx.fillText(labels[i], 10, y + barHeight / 2 + 5);

        // Bar
        ctx.fillStyle = barColors[i];
        ctx.beginPath();
        ctx.roundRect(120, y, Math.max(barWidth, 4), barHeight, 6);
        ctx.fill();

        // Value
        ctx.fillStyle = "#f1f5f9";
        ctx.font = "bold 13px Segoe UI, sans-serif";
        ctx.fillText(values[i] + " hrs", 120 + barWidth + 10, y + barHeight / 2 + 5);
    }
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", function () {
    var saveBtn = document.getElementById("saveTimeBtn");
    saveBtn.addEventListener("click", saveTimeLog);

    var hoursInput = document.getElementById("screenHours");
    hoursInput.addEventListener("change", updateInsight);  // onchange
    hoursInput.addEventListener("input", updateInsight);   // live

    renderTimeLogs();
});
