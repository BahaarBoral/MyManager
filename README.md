MyManager 🎯
MyManager is a personal productivity, finance, and time-tracking web application designed to give you a quick snapshot of your daily habits. It provides tools to track expenses, monitor screen time, manage tasks, and maintain focus—all in one beautifully designed, centralized dashboard.

"This dashboard gives you a quick snapshot of your time and money. No judgement, just awareness."

🚀 Features
📊 Interactive Dashboard: A central hub displaying core statistics like total money spent, screen time, and productive Pomodoro hours. Includes a dynamic, motivational ticker and priority task previews.
💸 Money Leak: Track your daily expenses and monitor where your money is going.
⏳ Time Sink: Log and visualize your daily screen time and digital habits.
🍅 Pomodoro Timer: A built-in focus timer to help implement the Pomodoro technique for deep work.
🎯 Task Management: A to-do list interface to keep track of your daily goals and assignments.
📈 Analytics: Visual charts and data representations of your tracked time and finances.
🎮 Games (Brainteasers & Wordle): Quick mental breaks built right into the app to help you recharge between focus sessions.
🔐 Authentication: Simple frontend login and registration flow.
🎨 Dynamic Themes: Customizable UI themes (handled via themes.js).
🛠️ Technology Stack
Frontend Structure: HTML5
Styling: Vanilla CSS3 (with FontAwesome icons for UI elements)
Logic & Interactivity: Vanilla JavaScript (ES6+)
Storage: Browser localStorage (for themes, auth state, and user data)

📁 Project Structure
MyManager/
├── index.html        # Main Dashboard
├── login.html        # User Login
├── register.html     # User Registration
├── money.html        # Money Leak Tracker
├── time.html         # Time Sink Tracker
├── tasks.html        # Task Manager
├── pomodoro.html     # Pomodoro Timer
├── analytics.html    # Data Analytics
├── games.html        # Mini-games portal
├── profile.html      # User Profile
├── about.html        # About Page
├── css/
│   └── style.css     # Global Stylesheet
├── js/
│   ├── auth.js       # Authentication logic
│   ├── dashboard.js  # Dashboard widget logic 
│   ├── pomodoro.js   # Timer logic
│   ├── themes.js     # Theme switcher logic
│   ├── loader.js     # Page transition loader
│   ├── money.js      # Expense tracking logic
│   ├── time.js       # Screen time logic
│   ├── tasks.js      # To-do list logic
│   ├── analytics.js  # Chart rendering
│   ├── wordle.js     # Wordle game logic
│   └── brainteaser.js# Brainteaser game logic
└── assets/           # Images and static assets

💻 How to Run Locally
Since MyManager is built with standard web technologies (HTML/CSS/JS) and doesn't require a backend database (using localStorage instead), it is incredibly easy to run!

Clone or Download the repository to your local machine.
Open the folder in your preferred code editor (like VS Code).
Run a Local Server (Optional but recommended for precise JS execution):
In VS Code, you can use the Live Server extension. Simply right-click 
login.html or index.html and select "Open with Live Server".
Alternatively, you can use Python: python -m http.server 8000 (then visit http://localhost:8000 in your browser).
Login: If prompted by the auth.js script, create an account or bypass it via the UI to access the main index.html dashboard.


👨‍💻 Author
Bahaar Boral (24BCE1760)
