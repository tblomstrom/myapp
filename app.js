const STORAGE_KEY = "todos";

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString() + "-" + Math.random().toString(36).slice(2);
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos(todos) {
  const list = document.getElementById("todo-list");
  list.textContent = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.setAttribute("data-id", todo.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-toggle";
    checkbox.checked = !!todo.completed;

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "todo-delete";
    deleteBtn.setAttribute("aria-label", "Delete");
    deleteBtn.textContent = "×";

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ id: generateId(), text: text, completed: false });
  saveTodos(todos);
  return todos;
}

function toggleTodo(id) {
  const todos = loadTodos();
  const updated = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(updated);
  return updated;
}

function deleteTodo(id) {
  const todos = loadTodos();
  const updated = todos.filter((todo) => todo.id !== id);
  saveTodos(updated);
  return updated;
}

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const todos = addTodo(text);
  input.value = "";
  renderTodos(todos);
});

list.addEventListener("change", (event) => {
  if (!event.target.classList.contains("todo-toggle")) return;
  const item = event.target.closest(".todo-item");
  if (!item) return;
  const id = item.getAttribute("data-id");
  const todos = toggleTodo(id);
  renderTodos(todos);
});

list.addEventListener("click", (event) => {
  if (!event.target.classList.contains("todo-delete")) return;
  const item = event.target.closest(".todo-item");
  if (!item) return;
  const id = item.getAttribute("data-id");
  const todos = deleteTodo(id);
  renderTodos(todos);
});

renderTodos(loadTodos());
