const taskList = document.querySelector('#task-list');
const addForm = document.querySelector('#add-form');
const newTaskInput = document.querySelector('#new-task');

function makeTask(label) {
  const item = document.createElement('li');
  item.className = 'task';

  const button = document.createElement('button');
  button.className = 'task-toggle';
  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');

  const text = document.createElement('span');
  text.textContent = label;
  const check = document.createElement('span');
  check.className = 'check';
  check.setAttribute('aria-hidden', 'true');
  check.textContent = '✓';

  button.append(text, check);
  item.append(button);
  return item;
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const label = newTaskInput.value.trim();
  if (!label) {
    newTaskInput.focus();
    return;
  }
  taskList.append(makeTask(label));
  newTaskInput.value = '';
  newTaskInput.focus();
});

taskList.addEventListener('click', (event) => {
  const button = event.target.closest('.task-toggle');
  if (!button) return;
  const item = button.closest('.task');
  const done = item.classList.toggle('is-done');
  button.setAttribute('aria-pressed', String(done));
});

// A short hold removes an item, matching the interaction described in the header.
let holdTimer;
let heldButton;
let holdTriggered = false;

taskList.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('.task-toggle');
  if (!button || event.button !== 0) return;
  heldButton = button;
  holdTriggered = false;
  holdTimer = window.setTimeout(() => {
    if (!heldButton?.isConnected) return;
    holdTriggered = true;
    heldButton.closest('.task')?.remove();
  }, 650);
});

function cancelHold() {
  window.clearTimeout(holdTimer);
  heldButton = null;
}

taskList.addEventListener('pointerup', cancelHold);
taskList.addEventListener('pointerleave', cancelHold);
taskList.addEventListener('pointercancel', cancelHold);
taskList.addEventListener('click', (event) => {
  if (holdTriggered) {
    event.stopImmediatePropagation();
    holdTriggered = false;
  }
}, true);
