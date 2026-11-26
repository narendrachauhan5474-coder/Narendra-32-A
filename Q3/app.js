const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#tasks");
const empty = document.querySelector("#empty");

function moveTask(item, offset) {
  const items = [...list.children];
  const index = items.indexOf(item);
  const target = index + offset;
  if (target < 0 || target >= items.length) return;
  if (offset < 0) list.insertBefore(item, items[target]);
  else list.insertBefore(items[target], item);
}

function refreshEmptyState() {
  empty.hidden = list.children.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const item = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", `Mark "${text}" complete`);
  const label = document.createElement("span");
  label.textContent = text;
  checkbox.addEventListener("change", () => item.classList.toggle("done", checkbox.checked));

  const up = document.createElement("button");
  up.type = "button";
  up.textContent = "↑";
  up.setAttribute("aria-label", "Move task up");
  up.addEventListener("click", () => moveTask(item, -1));
  const down = document.createElement("button");
  down.type = "button";
  down.textContent = "↓";
  down.setAttribute("aria-label", "Move task down");
  down.addEventListener("click", () => moveTask(item, 1));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Delete";
  remove.className = "delete";
  remove.addEventListener("click", () => { item.remove(); refreshEmptyState(); });

  item.append(checkbox, label, up, down, remove);
  list.append(item);
  input.value = "";
  input.focus();
  refreshEmptyState();
});
