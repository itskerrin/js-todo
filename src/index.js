// Variables

// Projects
const projectContainer = document.querySelector('[data-projects]');
const newProject = document.querySelector('[data-new-project]');
const newProjectInput = document.querySelector('[data-new-project-input]');
const deleteProjectBtn = document.querySelector('[data-delete-project-btn]');
const projectTasksContainer = document.querySelector(
  '[data-project-task-container]'
);
const projectTitleElement = document.querySelector('[data-project-title]');

// Tasks
const counter = document.querySelector('[data-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTask = document.querySelector('[data-new-task]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteBtn = document.querySelector('[data-clear-complete-btn]');

// Storage
const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'task.selectedProjectId';
let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
);

// Event Listeners

// Select project
projectContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});

// Check task and update counter. Find current project, save task to it, if task is complete, update counter.
tasksContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderCounter(selectedProject);
  }
});

// Clear the completed tasks, filter and save only those not completed
clearCompleteBtn.addEventListener('click', (e) => {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => !task.complete
  );
  saveAndRender();
});

// Delete an entire project. Filter by all that arent selected and save
deleteProjectBtn.addEventListener('click', (e) => {
  projects = projects.filter((project) => project.id !== selectedProjectId);
  selectedProjectId = null;
  saveAndRender();
});

// Add a new project, clear form and push to list
newProject.addEventListener('submit', (e) => {
  e.preventDefault();
  const projectName = newProjectInput.value;
  if (projectName == null || projectName === '') return;
  const project = createProject(projectName);
  newProjectInput.value = null;
  projects.push(project);
  saveAndRender();
});

// Add a new task
newTask.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks.push(task);
  saveAndRender();
});

// Functions

// Create a project
function createProject(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

// Create a task
function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

// Save and render local storage
function saveAndRender() {
  save();
  render();
}

// Save to local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY,
    selectedProjectId
  );
}

// Render tasks of the selected project, or display none
function render() {
  clearElement(projectContainer);
  renderProjects();

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  if (selectedProjectId == null) {
    projectTasksContainer.style.display = 'none';
  } else {
    projectTasksContainer.style.display = '';
    projectTitleElement.innerText = selectedProject.name;
    renderCounter(selectedProject);
    clearElement(tasksContainer);
    renderTasks(selectedProject);
  }
}

// Render tasks, using the task template (html)
function renderTasks(selectedProject) {
  selectedProject.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

// Counter, find how many, print string
function renderCounter(selectedProject) {
  const incompleteTasks = selectedProject.tasks.filter(
    (task) => !task.complete
  ).length;
  const tasksLeft = incompleteTasks === 1 ? 'task' : 'tasks';
  counter.innerText = `${incompleteTasks} ${tasksLeft} to go!`;
}

// Render the list of projects
function renderProjects() {
  projects.forEach((project) => {
    const projectElement = document.createElement('li');
    projectElement.dataset.projectId = project.id;
    projectElement.classList.add('list-name');
    projectElement.innerText = project.name;
    if (project.id === selectedProjectId) {
      projectElement.classList.add('active-list');
    }
    projectContainer.appendChild(projectElement);
  });
}

// Clears passed element
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
