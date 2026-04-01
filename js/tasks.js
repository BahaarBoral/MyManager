// ===== TASKS — Persistent To-Do List JS =====
// Concepts: addEventListener (keypress, click, change), for loop, splice, localStorage, DOM manipulation

// --- Load tasks from localStorage ---
function getTasks() {
    var data = localStorage.getItem("tasks");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

// --- Save tasks to localStorage ---
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Render tasks ---
function renderTasks() {
    var tasks = getTasks();
    var taskList = document.getElementById("taskList");
    var countEl = document.getElementById("taskCount");

    taskList.innerHTML = "";

    var completedCount = 0;

    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];

        if (task.completed) {
            completedCount++;
        }

        var li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("data-index", i);
        checkbox.addEventListener("change", function () {
            toggleTask(parseInt(this.getAttribute("data-index")));
        });

        // Text
        var span = document.createElement("span");
        span.innerText = task.text;
        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.5";
        }

        // Delete button
        var delBtn = document.createElement("button");
        delBtn.innerText = "✕";
        delBtn.className = "delete-btn";
        delBtn.setAttribute("data-index", i);
        delBtn.addEventListener("click", function () {
            deleteTask(parseInt(this.getAttribute("data-index")));
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    }

    // Update count badge
    if (countEl) {
        countEl.innerText = completedCount + "/" + tasks.length + " done";
    }
}

// --- Add a new task ---
function addTask() {
    var input = document.getElementById("taskInput");
    var text = input.value.trim();

    if (text === "") return;

    var tasks = getTasks();
    tasks.push({ text: text, completed: false });
    saveTasks(tasks);

    input.value = "";
    renderTasks();
}

// --- Toggle task completed ---
function toggleTask(index) {
    var tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// --- Delete a task ---
function deleteTask(index) {
    var tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

// --- Clear all completed tasks ---
function clearCompleted() {
    var tasks = getTasks();
    var remaining = [];

    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            remaining.push(tasks[i]);
        }
    }

    saveTasks(remaining);
    renderTasks();
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", function () {
    renderTasks();

    // Add task on button click
    var addBtn = document.getElementById("addTaskBtn");
    if (addBtn) {
        addBtn.addEventListener("click", addTask);
    }

    // Add task on Enter key press
    var taskInput = document.getElementById("taskInput");
    if (taskInput) {
        taskInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                addTask();
            }
        });
    }
});
