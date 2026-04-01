// ===== MONEY LEAK — Expense Tracker JS =====
// Concepts: addEventListener, getElementById, for loop, localStorage, JSON, form validation, onchange, DOM manipulation

// --- Load expenses from localStorage ---
function getExpenses() {
  var data = localStorage.getItem("expenses");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

// --- Save expenses to localStorage ---
function saveExpenses(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// --- Render the expense table ---
function renderExpenses() {
  var expenses = getExpenses();
  var tableBody = document.getElementById("expenseTableBody");
  var totalDisplay = document.getElementById("expenseTotal");

  // Clear old rows
  tableBody.innerHTML = "";

  var total = 0;

  // for loop — iterating through expense array
  for (var i = 0; i < expenses.length; i++) {
    var exp = expenses[i];
    total = total + exp.amount;

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + exp.date + "</td>" +
      "<td>Rs. " + exp.amount + "</td>" +
      "<td>" + exp.category + "</td>" +
      "<td>" + exp.reason + "</td>" +
      '<td><button class="delete-btn" onclick="deleteExpense(' + i + ')">✕</button></td>';

    tableBody.appendChild(row);
  }

  totalDisplay.innerText = "Rs. " + total;

  // Update count badge
  var countBadge = document.getElementById("expenseCount");
  if (countBadge) {
    countBadge.innerText = expenses.length + " entries";
  }
}

// --- Add expense on form submit ---
function handleExpenseSubmit(event) {
  event.preventDefault(); // prevent page reload

  var amountInput = document.getElementById("expenseAmount");
  var categorySelect = document.getElementById("expenseCategory");
  var reasonSelect = document.getElementById("expenseReason");
  var messageEl = document.getElementById("expenseMessage");

  var amount = parseFloat(amountInput.value);

  // --- Validation ---
  if (isNaN(amount) || amount <= 0) {
    messageEl.innerText = "⚠️ Please enter a valid amount greater than 0.";
    messageEl.style.color = "#ef4444";
    return;
  }

  // Clear validation message
  messageEl.innerText = "";

  var expense = {
    date: new Date().toLocaleDateString("en-IN"),
    amount: amount,
    category: categorySelect.value,
    reason: reasonSelect.value
  };

  var expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);

  // Reset form
  amountInput.value = "";
  messageEl.innerText = "✅ Expense added!";
  messageEl.style.color = "#34d399";

  renderExpenses();
}

// --- Delete a single expense ---
function deleteExpense(index) {
  var expenses = getExpenses();
  expenses.splice(index, 1); // remove 1 item at index
  saveExpenses(expenses);
  renderExpenses();
}

// --- Clear all expenses ---
function clearAllExpenses() {
  if (confirm("Are you sure you want to clear all expenses?")) {
    localStorage.removeItem("expenses");
    renderExpenses();
  }
}

// --- onchange: Live validation on amount input ---
function validateAmount() {
  var amountInput = document.getElementById("expenseAmount");
  var messageEl = document.getElementById("expenseMessage");
  var val = parseFloat(amountInput.value);

  if (amountInput.value !== "" && (isNaN(val) || val <= 0)) {
    messageEl.innerText = "⚠️ Amount must be a positive number.";
    messageEl.style.color = "#ef4444";
  } else {
    messageEl.innerText = "";
  }
}

// --- Initialize when page loads ---
window.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("expenseForm");
  form.addEventListener("submit", handleExpenseSubmit);

  var amountInput = document.getElementById("expenseAmount");
  amountInput.addEventListener("change", validateAmount);    // onchange
  amountInput.addEventListener("input", validateAmount);     // live feedback

  renderExpenses();
});
