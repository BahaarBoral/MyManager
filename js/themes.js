// ===== THEME SYSTEM — 5 Themes =====
// Dark (default), Light, Techie, Lofi, Pastel
// Saves to localStorage, loads on every page

var THEMES = {
    dark: {
        name: "Dark",
        icon: "🌙",
        vars: {
            "--bg-main": "#0f172a",
            "--bg-secondary": "#1e293b",
            "--bg-card": "#1a2236",
            "--border-color": "#2a3448",
            "--text-primary": "#f1f5f9",
            "--text-secondary": "#94a3b8",
            "--accent": "#34d399",
            "--accent-hover": "#10b981",
            "--danger": "#ef4444"
        }
    },
    light: {
        name: "Light",
        icon: "☀️",
        vars: {
            "--bg-main": "#f8fafc",
            "--bg-secondary": "#ffffff",
            "--bg-card": "#ffffff",
            "--border-color": "#e2e8f0",
            "--text-primary": "#1e293b",
            "--text-secondary": "#64748b",
            "--accent": "#0d9488",
            "--accent-hover": "#0f766e",
            "--danger": "#dc2626"
        }
    },
    techie: {
        name: "Techie",
        icon: "💻",
        vars: {
            "--bg-main": "#0a0a0a",
            "--bg-secondary": "#111111",
            "--bg-card": "#0d0d0d",
            "--border-color": "#1a3a1a",
            "--text-primary": "#00ff41",
            "--text-secondary": "#00cc33",
            "--accent": "#00ff41",
            "--accent-hover": "#00cc33",
            "--danger": "#ff0040"
        }
    },
    lofi: {
        name: "Lofi",
        icon: "🎵",
        vars: {
            "--bg-main": "#2c1810",
            "--bg-secondary": "#3d261c",
            "--bg-card": "#352015",
            "--border-color": "#5a3d2e",
            "--text-primary": "#f5e6d3",
            "--text-secondary": "#c4a882",
            "--accent": "#e8944a",
            "--accent-hover": "#d47e35",
            "--danger": "#c44536"
        }
    },
    pastel: {
        name: "Pastel",
        icon: "🌸",
        vars: {
            "--bg-main": "#fdf2f8",
            "--bg-secondary": "#fce7f3",
            "--bg-card": "#fff1f5",
            "--border-color": "#f9a8d4",
            "--text-primary": "#831843",
            "--text-secondary": "#9d174d",
            "--accent": "#c084fc",
            "--accent-hover": "#a855f7",
            "--danger": "#f43f5e"
        }
    }
};

// Apply a theme
function applyTheme(themeName) {
    var theme = THEMES[themeName];
    if (!theme) theme = THEMES.dark;

    var root = document.documentElement;
    var vars = theme.vars;
    var keys = Object.keys(vars);

    for (var i = 0; i < keys.length; i++) {
        root.style.setProperty(keys[i], vars[keys[i]]);
    }

    localStorage.setItem("mymanager_theme", themeName);

    // Update active state on buttons if they exist
    var btns = document.querySelectorAll(".profile-theme-btn");
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
        if (btns[i].getAttribute("data-theme") === themeName) {
            btns[i].classList.add("active");
        }
    }
}

function initThemeSwatches() {
    var swatches = document.querySelectorAll(".profile-theme-btn");
    for (var i = 0; i < swatches.length; i++) {
        swatches[i].addEventListener("click", function () {
            var themeName = this.getAttribute("data-theme");
            applyTheme(themeName);
        });
    }
}

// SYNCHRONOUS INITIALIZATION to prevent flash of unstyled content
var savedTheme = localStorage.getItem("mymanager_theme") || "dark";
applyTheme(savedTheme);

// Wait for DOM to wire up buttons
window.addEventListener("DOMContentLoaded", initThemeSwatches);
