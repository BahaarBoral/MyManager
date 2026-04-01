// ===== ANALYTICS — Charts & Insights JS =====
// Concepts: Canvas API (arc, fillRect, fillText), Math.PI, for loop, switch, onchange, dynamic DOM

window.addEventListener("DOMContentLoaded", function () {
    updateAnalytics();

    // Date filter onchange
    var filterSelect = document.getElementById("dateFilter");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            updateAnalytics();
        });
    }

    // onmouseover/onmouseout on analytics boxes
    var boxes = document.querySelectorAll(".analytics-box");
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("mouseover", function () {
            this.style.borderColor = "#34d399";
            this.style.boxShadow = "0 20px 60px rgba(52, 211, 153, 0.25)";
        });
        boxes[i].addEventListener("mouseout", function () {
            this.style.borderColor = "#2a3448";
            this.style.boxShadow = "0 15px 40px rgba(0,0,0,0.25)";
        });
    }
});

// --- Get filter range ---
function getFilterDays() {
    var filterSelect = document.getElementById("dateFilter");
    if (!filterSelect) return 9999;

    var val = filterSelect.value;
    switch (val) {
        case "today": return 0;
        case "week": return 7;
        case "month": return 30;
        default: return 9999;
    }
}

// --- Check if date string is within range ---
function isWithinRange(dateStr, days) {
    if (days === 9999) return true;

    // Parse dd/mm/yyyy or other locale formats
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var parts = dateStr.split("/");
    var logDate;
    if (parts.length === 3) {
        // Try dd/mm/yyyy
        logDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        logDate = new Date(dateStr);
    }

    var diff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
    return diff <= days;
}

// --- Main analytics update ---
function updateAnalytics() {
    var filterDays = getFilterDays();

    // --- Expenses ---
    var expenses = [];
    var expData = localStorage.getItem("expenses");
    if (expData) {
        var allExp = JSON.parse(expData);
        for (var i = 0; i < allExp.length; i++) {
            if (isWithinRange(allExp[i].date, filterDays)) {
                expenses.push(allExp[i]);
            }
        }
    }

    var totalMoney = 0;
    var categoryTotals = {};
    for (var i = 0; i < expenses.length; i++) {
        totalMoney += expenses[i].amount;
        var cat = expenses[i].category;
        if (categoryTotals[cat]) {
            categoryTotals[cat] += expenses[i].amount;
        } else {
            categoryTotals[cat] = expenses[i].amount;
        }
    }
    document.getElementById("analyticsMoney").innerText = "Rs. " + totalMoney;

    // --- Time Logs ---
    var timeLogs = [];
    var timeData = localStorage.getItem("timeLogs");
    if (timeData) {
        var allTime = JSON.parse(timeData);
        for (var i = 0; i < allTime.length; i++) {
            if (isWithinRange(allTime[i].date, filterDays)) {
                timeLogs.push(allTime[i]);
            }
        }
    }

    var totalScreen = 0;
    var activityTotals = { "Studying": 0, "Social Media": 0, "Entertainment": 0, "Shopping": 0 };
    for (var i = 0; i < timeLogs.length; i++) {
        totalScreen += timeLogs[i].hours;
        var perAct = timeLogs[i].hours / timeLogs[i].activities.length;
        for (var j = 0; j < timeLogs[i].activities.length; j++) {
            var act = timeLogs[i].activities[j];
            if (activityTotals.hasOwnProperty(act)) {
                activityTotals[act] += perAct;
            }
        }
    }
    totalScreen = Math.round(totalScreen * 10) / 10;
    document.getElementById("analyticsTime").innerText = totalScreen + " hrs";

    // --- Pomodoro ---
    var totalPomodoro = 0;
    var pomData = localStorage.getItem("pomodoroSessions");
    if (pomData) {
        var sessions = JSON.parse(pomData);
        for (var i = 0; i < sessions.length; i++) {
            totalPomodoro += sessions[i].minutes;
        }
    }
    var pomHours = Math.round((totalPomodoro / 60) * 10) / 10;
    document.getElementById("analyticsPomodoro").innerText = pomHours + " hrs";

    // --- Draw Charts ---
    drawExpensePieChart(categoryTotals, totalMoney);
    drawTimeBarChart(activityTotals);
    drawCorrelationChart(expenses, timeLogs);
    drawTimePatternChart(timeLogs);
    drawRadarChart(activityTotals, pomHours);

    // --- Generate Insights ---
    generateInsights(totalMoney, totalScreen, pomHours, categoryTotals, activityTotals, expenses, timeLogs);
}

// ==========================================
// PIE CHART (Expenses by Category)
// ==========================================
function drawExpensePieChart(categoryTotals, total) {
    var canvas = document.getElementById("expenseChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width; // reset
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var labels = Object.keys(categoryTotals);
    var values = [];
    for (var i = 0; i < labels.length; i++) {
        values.push(categoryTotals[labels[i]]);
    }

    if (labels.length === 0 || total === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText("No expense data yet. Add expenses to see the chart!", 20, canvas.height / 2);
        return;
    }

    var colors = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#fb923c"];
    var centerX = 150;
    var centerY = 140;
    var radius = 110;
    var startAngle = 0;

    // Draw slices
    for (var i = 0; i < labels.length; i++) {
        var sliceAngle = (values[i] / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Slice label
        var midAngle = startAngle + sliceAngle / 2;
        var labelX = centerX + (radius * 0.6) * Math.cos(midAngle);
        var labelY = centerY + (radius * 0.6) * Math.sin(midAngle);
        var pct = Math.round((values[i] / total) * 100);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 12px Segoe UI, sans-serif";
        ctx.fillText(pct + "%", labelX - 10, labelY + 4);

        startAngle += sliceAngle;
    }

    // Legend
    var legendX = 290;
    var legendY = 40;
    ctx.font = "13px Segoe UI, sans-serif";
    for (var i = 0; i < labels.length; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(legendX, legendY + i * 28, 16, 16);
        ctx.fillStyle = "#f1f5f9";
        ctx.fillText(labels[i] + " — Rs. " + values[i], legendX + 24, legendY + i * 28 + 13);
    }
}

// ==========================================
// BAR CHART (Screen Time by Activity)
// ==========================================
function drawTimeBarChart(activityTotals) {
    var canvas = document.getElementById("timeChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var labels = Object.keys(activityTotals);
    var values = [];
    for (var i = 0; i < labels.length; i++) {
        values.push(Math.round(activityTotals[labels[i]] * 10) / 10);
    }

    var hasData = false;
    for (var i = 0; i < values.length; i++) {
        if (values[i] > 0) hasData = true;
    }

    if (!hasData) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText("No screen time data yet. Log your time!", 20, canvas.height / 2);
        return;
    }

    var maxVal = 0;
    for (var i = 0; i < values.length; i++) {
        if (values[i] > maxVal) maxVal = values[i];
    }
    if (maxVal === 0) maxVal = 1;

    var colors = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24"];
    var barWidth = 60;
    var gap = 30;
    var chartBottom = canvas.height - 50;
    var chartTop = 40;
    var maxBarHeight = chartBottom - chartTop;
    var startX = 60;

    // Title
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 16px Segoe UI, sans-serif";
    ctx.fillText("Screen Time by Activity", 10, 25);

    // Y-axis line
    ctx.strokeStyle = "#2a3448";
    ctx.beginPath();
    ctx.moveTo(50, chartTop);
    ctx.lineTo(50, chartBottom);
    ctx.stroke();

    // X-axis line
    ctx.beginPath();
    ctx.moveTo(50, chartBottom);
    ctx.lineTo(canvas.width - 10, chartBottom);
    ctx.stroke();

    for (var i = 0; i < labels.length; i++) {
        var x = startX + i * (barWidth + gap);
        var barHeight = (values[i] / maxVal) * maxBarHeight;
        var y = chartBottom - barHeight;

        // Bar
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
        ctx.fill();

        // Value on top
        ctx.fillStyle = "#f1f5f9";
        ctx.font = "bold 13px Segoe UI, sans-serif";
        ctx.fillText(values[i] + "h", x + 12, y - 8);

        // Label below
        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px Segoe UI, sans-serif";
        ctx.fillText(labels[i], x - 5, chartBottom + 20);
    }
}

// ==========================================
// DYNAMIC INSIGHTS
// ==========================================
function generateInsights(totalMoney, totalScreen, pomHours, catTotals, actTotals, expenses, timeLogs) {
    var insightsList = document.getElementById("insightsList");
    if (!insightsList) return;

    insightsList.innerHTML = "";

    var insights = [];

    // Money insights
    if (totalMoney === 0) {
        insights.push("No expenses logged yet. Start tracking to see patterns!");
    } else {
        var topCat = "";
        var topVal = 0;
        var cats = Object.keys(catTotals);
        for (var i = 0; i < cats.length; i++) {
            if (catTotals[cats[i]] > topVal) {
                topVal = catTotals[cats[i]];
                topCat = cats[i];
            }
        }
        insights.push("💸 You spent the most on <b>" + topCat + "</b> (Rs. " + topVal + ").");

        if (totalMoney > 1000) {
            insights.push("⚠️ Total spending crossed Rs. 1000. Time to review!");
        }
    }

    // Screen time insights
    if (totalScreen === 0) {
        insights.push("📱 No screen time logged yet.");
    } else {
        if (totalScreen > 10) {
            insights.push("😬 Over 10 hours total screen time. Try setting daily limits.");
        }
        if (actTotals["Social Media"] > actTotals["Studying"]) {
            insights.push("📵 Social media time exceeds study time. Try swapping 30 min!");
        }
        if (actTotals["Studying"] > 0 && actTotals["Studying"] >= actTotals["Social Media"]) {
            insights.push("📚 Great job! Study time is equal or more than social media.");
        }
    }

    // Pomodoro insights
    if (pomHours > 0) {
        if (pomHours >= 2) {
            insights.push("🔥 Over 2 hours of focused work! Keep the streak going.");
        } else {
            insights.push("🍅 Good start with Pomodoro. Try reaching 2 hours of focus.");
        }
    }

    // Correlation insights
    var highSpendDays = 0;
    var highStudyDays = 0;
    var nightMobiles = 0;

    // Map data by date
    var byDate = {};
    for (var i = 0; i < expenses.length; i++) {
        var d = expenses[i].date;
        if (!byDate[d]) byDate[d] = { spent: 0, studied: 0, night: false };
        byDate[d].spent += expenses[i].amount;
    }
    for (var i = 0; i < timeLogs.length; i++) {
        var d = timeLogs[i].date;
        if (!byDate[d]) byDate[d] = { spent: 0, studied: 0, night: false };

        if (timeLogs[i].activities.includes("Studying")) {
            byDate[d].studied += timeLogs[i].hours;
        }
        if (timeLogs[i].peak === "Night") {
            byDate[d].night = true;
        }
    }

    var dates = Object.keys(byDate);
    var nightSpend = 0;
    var studiedSpend = 0;

    for (var k = 0; k < dates.length; k++) {
        var day = byDate[dates[k]];
        if (day.spent > 500) highSpendDays++;
        if (day.studied > 2) highStudyDays++;

        if (day.night) {
            nightMobiles++;
            nightSpend += day.spent;
        }

        if (day.studied > 2) {
            studiedSpend += day.spent;
        }
    }

    if (nightMobiles > 0 && nightSpend > 0) {
        insights.push("🕒 You spend most money on days you use screens heavily at Night (Avg Rs. " + Math.round(nightSpend / nightMobiles) + ").");
    }

    if (highStudyDays > 0) {
        var avgStudySpend = Math.round(studiedSpend / highStudyDays);
        if (avgStudySpend < (totalMoney / dates.length || 0)) {
            insights.push("📉 On days you study 2+ hours, you spend significantly less money! Keep studying.");
        }
    }

    // Render
    for (var i = 0; i < insights.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = insights[i];
        insightsList.appendChild(li);
    }
}

// ==========================================
// CORRELATION CHART (Line Chart)
// ==========================================
function drawCorrelationChart(expenses, timeLogs) {
    var canvas = document.getElementById("correlationChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group by date
    var dateMap = {};

    for (var i = 0; i < expenses.length; i++) {
        var d = expenses[i].date;
        if (!dateMap[d]) dateMap[d] = { spent: 0, time: 0 };
        dateMap[d].spent += expenses[i].amount;
    }
    for (var i = 0; i < timeLogs.length; i++) {
        var d = timeLogs[i].date;
        if (!dateMap[d]) dateMap[d] = { spent: 0, time: 0 };
        dateMap[d].time += timeLogs[i].hours;
    }

    var dates = Object.keys(dateMap).sort();
    if (dates.length === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText("No data available for correlation.", 20, canvas.height / 2);
        return;
    }

    var chartBottom = canvas.height - 40;
    var chartTop = 40;
    var startX = 50;
    var endX = canvas.width - 50;
    var plotWidth = endX - startX;

    var maxSpent = 0;
    var maxTime = 0;
    for (var i = 0; i < dates.length; i++) {
        if (dateMap[dates[i]].spent > maxSpent) maxSpent = dateMap[dates[i]].spent;
        if (dateMap[dates[i]].time > maxTime) maxTime = dateMap[dates[i]].time;
    }

    if (maxSpent === 0) maxSpent = 1;
    if (maxTime === 0) maxTime = 1;

    // Draw Axes
    ctx.strokeStyle = "#2a3448";
    ctx.beginPath();
    ctx.moveTo(startX, chartTop);
    ctx.lineTo(startX, chartBottom); // Left Y (Money)
    ctx.lineTo(endX, chartBottom); // X
    ctx.lineTo(endX, chartTop); // Right Y (Time)
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#f472b6"; // Pink for money
    ctx.fillText("Money (Rs)", 10, 20);

    ctx.fillStyle = "#34d399"; // Green for time
    ctx.fillText("Time (Hrs)", endX - 30, 20);

    // Plot Lines
    var getX = function (index) {
        if (dates.length === 1) return startX + plotWidth / 2;
        return startX + index * (plotWidth / (dates.length - 1));
    };

    // Draw Time Line (Green)
    if (dates.length > 1) {
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var i = 0; i < dates.length; i++) {
            var x = getX(i);
            var y = chartBottom - (dateMap[dates[i]].time / maxTime) * (chartBottom - chartTop);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Draw Spent Line (Pink)
    if (dates.length > 1) {
        ctx.strokeStyle = "#f472b6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var i = 0; i < dates.length; i++) {
            var x = getX(i);
            var y = chartBottom - (dateMap[dates[i]].spent / maxSpent) * (chartBottom - chartTop);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Draw Points
    for (var i = 0; i < dates.length; i++) {
        var x = getX(i);

        // Time points
        var ty = chartBottom - (dateMap[dates[i]].time / maxTime) * (chartBottom - chartTop);
        ctx.fillStyle = "#34d399";
        ctx.beginPath(); ctx.arc(x, ty, 5, 0, Math.PI * 2); ctx.fill();

        // Spent points
        var sy = chartBottom - (dateMap[dates[i]].spent / maxSpent) * (chartBottom - chartTop);
        ctx.fillStyle = "#f472b6";
        ctx.beginPath(); ctx.arc(x, sy, 5, 0, Math.PI * 2); ctx.fill();

        // Date label (only show some if crowded)
        if (dates.length < 10 || i % 2 === 0) {
            ctx.fillStyle = "#94a3b8";
            ctx.font = "10px sans-serif";
            // extract dd/mm
            var dParts = dates[i].split("/");
            if (dParts.length > 1) {
                ctx.fillText(dParts[0] + "/" + dParts[1], x - 15, chartBottom + 15);
            }
        }
    }
}

// ==========================================
// TIME OF DAY PATTERN (Heatmap/Bubble)
// ==========================================
function drawTimePatternChart(timeLogs) {
    var canvas = document.getElementById("timePatternChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rows: Morning, Afternoon, Night
    // Cols: Average Hours
    var times = ["Morning", "Afternoon", "Night"];
    var data = { "Morning": 0, "Afternoon": 0, "Night": 0 };
    var counts = { "Morning": 0, "Afternoon": 0, "Night": 0 };

    var acts = {}; // Top activity per time

    for (var i = 0; i < timeLogs.length; i++) {
        var p = timeLogs[i].peak || "Not specified";
        if (data[p] !== undefined) {
            data[p] += timeLogs[i].hours;
            counts[p]++;
        }
    }

    var maxAvg = 0;
    for (var i = 0; i < times.length; i++) {
        var t = times[i];
        if (counts[t] > 0) data[t] = data[t] / counts[t];
        if (data[t] > maxAvg) maxAvg = data[t];
    }

    if (maxAvg === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText("Log Peak Times to see patterns.", 20, canvas.height / 2);
        return;
    }

    var startX = 100;
    var xStep = 100;
    var centerY = canvas.height / 2;

    // Draw base line
    ctx.strokeStyle = "#2a3448";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, centerY);
    ctx.lineTo(canvas.width - 50, centerY);
    ctx.stroke();

    var colors = ["#fbbf24", "#fb923c", "#34d399"]; // Yellow, Orange, Green

    for (var i = 0; i < times.length; i++) {
        var t = times[i];
        var x = startX + i * xStep;

        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Segoe UI, sans-serif";
        ctx.fillText(t, x - 25, centerY + 60);

        if (data[t] > 0) {
            var radius = 10 + (data[t] / maxAvg) * 35; // Size depends on avg hours

            // Draw bubble
            ctx.fillStyle = colors[i] + "aa"; // transparent hex
            ctx.beginPath();
            ctx.arc(x, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Outline
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 2;
            ctx.stroke();

            // Value inside
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            var text = Math.round(data[t] * 10) / 10 + "h";
            var metrics = ctx.measureText(text);
            ctx.fillText(text, x - metrics.width / 2, centerY + 5);
        } else {
            ctx.fillStyle = "#2a3448";
            ctx.beginPath();
            ctx.arc(x, centerY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ==========================================
// RADAR CHART (Productive vs Unproductive)
// ==========================================
function drawRadarChart(actTotals, pomHours) {
    var canvas = document.getElementById("radarChart");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cx = canvas.width / 2;
    var cy = 160;
    var radius = 100;

    var labels = ["Studying", "Focus (Pomodoro)", "Social Media", "Entertainment", "Shopping"];
    // Extract actual numeric totals, fallback to 0
    var data = [
        actTotals["Studying"] || 0,
        pomHours || 0,
        actTotals["Social Media"] || 0,
        actTotals["Entertainment"] || 0,
        actTotals["Shopping"] || 0
    ];

    var maxVal = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i] > maxVal) maxVal = data[i];
    }
    if (maxVal === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText("No habit data yet. Start logging time!", 20, canvas.height / 2);
        return;
    }
    // ensure maxVal is at least 1 or 5 for scale
    if (maxVal < 5) maxVal = 5;

    var numPoints = 5;
    var angleStep = (Math.PI * 2) / numPoints;

    // Draw grid (concentric pentagons)
    ctx.strokeStyle = "#475569";
    for (var step = 1; step <= 5; step++) {
        var r = radius * (step / 5);
        ctx.beginPath();
        for (var i = 0; i < numPoints; i++) {
            var angle = i * angleStep - Math.PI / 2;
            var x = cx + Math.cos(angle) * r;
            var y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Draw axes & labels
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "12px Segoe UI, sans-serif";
    for (var i = 0; i < numPoints; i++) {
        var angle = i * angleStep - Math.PI / 2;
        var r = radius;
        // Axis line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.stroke();

        // Label
        var lx = cx + Math.cos(angle) * (r + 20);
        var ly = cy + Math.sin(angle) * (r + 15);

        ctx.textAlign = (lx < cx - 10) ? "right" : (lx > cx + 10) ? "left" : "center";

        // Colors: productive (green) vs unproductive (red/orange)
        ctx.fillStyle = (i < 2) ? "#34d399" : "#fb923c";
        ctx.fillText(labels[i], lx, ly);
    }

    // Draw data polygon
    ctx.beginPath();
    for (var i = 0; i < numPoints; i++) {
        var angle = i * angleStep - Math.PI / 2;
        var r = radius * (data[i] / maxVal);
        var x = cx + Math.cos(angle) * r;
        var y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = "rgba(96, 165, 250, 0.4)"; // soft blue fill
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#60a5fa";
    ctx.stroke();

    // Draw dots for data points
    ctx.fillStyle = "#c084fc";
    for (var i = 0; i < numPoints; i++) {
        var angle = i * angleStep - Math.PI / 2;
        var r = radius * (data[i] / maxVal);
        var x = cx + Math.cos(angle) * r;
        var y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
