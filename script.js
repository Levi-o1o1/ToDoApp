/* ===============================
   GET ALL REQUIRED ELEMENTS
================================ */
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");

const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const doneSelectedBtn = document.getElementById("doneSelectedBtn");
const undoSelectedBtn = document.getElementById("undoSelectedBtn");

/* ===============================
   PAGE LOAD: RESTORE DATA
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
  updateActionButtons();
});

/* ===============================
   SETTINGS MENU LOGIC
================================ */
// Toggle settings menu
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent auto close
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";
});

// Close settings when clicking anywhere else
document.addEventListener("click", (e) => {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsMenu.style.display = "none";
  }
});

/* ===============================
   ADD TASK (BUTTON + ENTER KEY)
================================ */
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  createTask({
    text: text,
    selected: false,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
}

/* ===============================
   CREATE TASK UI
================================ */
function createTask(task) {
  const li = document.createElement("li");

  /* LEFT SIDE (CHECKBOX + TEXT) */
  const left = document.createElement("div");
  left.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.selected;

  const span = document.createElement("span");
  span.textContent = task.text;

  // Restore completed state
  if (task.completed) {
    span.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    updateActionButtons();
    saveTasks();
  });

  left.appendChild(checkbox);
  left.appendChild(span);

  /* RIGHT SIDE (EDIT + DELETE) */
  const actions = document.createElement("div");
  actions.className = "task-actions";

  // EDIT BUTTON
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏";
  editBtn.onclick = () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText) {
      span.textContent = newText;
      saveTasks();
    }
  };

  // DELETE SINGLE TASK
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.onclick = () => {
    li.remove();
    updateActionButtons();
    saveTasks();
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(left);
  li.appendChild(actions);
  taskList.appendChild(li);

  updateActionButtons();
}

/* ===============================
   DONE (MARK COMPLETED)
================================ */
function markSelectedDone() {
  document.querySelectorAll("#taskList li").forEach((li) => {
    const checkbox = li.querySelector("input");
    const text = li.querySelector("span");

    if (checkbox.checked) {
      text.classList.add("completed");
      checkbox.checked = false; // auto unselect
    }
  });

  updateActionButtons();
  saveTasks();
}

/* ===============================
   UNDO (REMOVE COMPLETED)
================================ */
function undoSelectedDone() {
  document.querySelectorAll("#taskList li").forEach((li) => {
    const checkbox = li.querySelector("input");
    const text = li.querySelector("span");

    if (checkbox.checked && text.classList.contains("completed")) {
      text.classList.remove("completed");
      checkbox.checked = false;
    }
  });

  updateActionButtons();
  saveTasks();
}

/* ===============================
   DELETE SELECTED TASKS
================================ */
function deleteSelectedTasks() {
  document.querySelectorAll("#taskList li").forEach((li) => {
    if (li.querySelector("input").checked) {
      li.remove();
    }
  });

  updateActionButtons();
  saveTasks();
}

/* ===============================
   SHOW / HIDE ACTION BUTTONS
================================ */
function updateActionButtons() {
  const tasks = [...document.querySelectorAll("#taskList li")];

  const anySelected = tasks.some((li) => li.querySelector("input").checked);
  const anyCompletedSelected = tasks.some(
    (li) =>
      li.querySelector("input").checked &&
      li.querySelector("span").classList.contains("completed")
  );

  deleteSelectedBtn.style.display = anySelected ? "block" : "none";
  doneSelectedBtn.style.display = anySelected ? "block" : "none";
  undoSelectedBtn.style.display = anyCompletedSelected ? "block" : "none";
}

/* ===============================
   SAVE TASKS TO LOCAL STORAGE
================================ */
function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      selected: li.querySelector("input").checked,
      completed: li.querySelector("span").classList.contains("completed"),
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ===============================
   LOAD TASKS FROM STORAGE
================================ */
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTask(task));
}

/* ===============================
   CLEAR ALL TASKS
================================ */
function clearAllTasks() {
  if (confirm("Delete all tasks?")) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
    updateActionButtons();
  }
}

/* ===============================
   DARK MODE (SAVE STATE)
================================ */
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}
