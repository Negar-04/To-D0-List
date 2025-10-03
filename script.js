const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

function renderTasks() {
  taskList.innerHTML = '';
  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  tasks
    .filter(task => {
      // فیلتر جست‌وجو
      const matchesSearch = task.text.toLowerCase().includes(searchTerm);

      // فیلتر وضعیت
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;

      return matchesSearch;
    })
    .forEach((task, index) => {
      const li = document.createElement('li');

      const content = document.createElement('div');
      content.classList.add('task-content');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;

      const span = document.createElement('span');
      span.textContent = task.text;
      if (task.completed) {
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.6";
      }

      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        saveAndRender();
      });

      span.addEventListener('dblclick', () => editTask(index));

      content.appendChild(checkbox);
      content.appendChild(span);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'حذف';
      delBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveAndRender();
      });

      li.appendChild(content);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
}

function editTask(index) {
  const newText = prompt('ویرایش کار:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}
