let todoList = [];

function addTodo() {
    let value = document.getElementById('todoInput').value;
    if (value) {
        addTodoItem(value);
        document.getElementById('todoInput').value = '';
    }
}

function addTodoItem(text) {
    const todoItem = {text, done: false, date: new Date()};
    todoList.push(todoItem);
    saveTodos();
    renderTodos();
}

function toggleAll() {
    let allDone = todoList.every(todo => todo.done);
    todoList.forEach(todo => (todo.done = !allDone));
    saveTodos();
    renderTodos();
}

function sortAlpha() {
    todoList.sort((a, b) => a.text.localeCompare(b.text));
    saveTodos();
    renderTodos();
}

function sortDate() {
    todoList.sort((a, b) => a.date - b.date);
    saveTodos();
    renderTodos();
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const themeButton = document.getElementById('toggleTheme');
    themeButton.innerText = document.body.classList.contains('dark') ? 'Light Theme' : 'Dark Theme';
    saveTheme();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todoList));
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todoList = JSON.parse(storedTodos);
    }
}

function renderTodos(filteredTodos = todoList) {
    const todoContainer = document.getElementById('todoList');
    todoContainer.innerHTML = '';

    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.innerText = 'No todos found';
        todoContainer.appendChild(emptyMessage);
        return;
    }

    for (let todo of filteredTodos) {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');

        const todoText = document.createElement('span');
        todoText.innerText = todo.text;
        todoElement.appendChild(todoText);

        const todoDate = document.createElement('span');
        todoDate.innerText = todo.date.toLocaleString();
        todoElement.appendChild(todoDate);

        const todoButtons = document.createElement('div');
        todoButtons.classList.add('todo-buttons');

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodoItem(todo));
        todoButtons.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => editTodoItem(todo));
        todoButtons.appendChild(editButton);

       

        todoElement.appendChild(todoButtons);
        todoContainer.appendChild(todoElement);
    }
}

function deleteTodoItem(todo) {
    todoList = todoList.filter(item => item !== todo);
    saveTodos();
    renderTodos();
}

function editTodoItem(todo) {
    const newText = prompt('Enter new text:', todo.text);
    if (newText !== null) {
        todo.text = newText;
        saveTodos();
        renderTodos();
    }
}

function restoreTodoItem(todo) {
    todoList.push(todo);
    saveTodos();
    renderTodos();
}

function filterTodos(filter) {
    let filteredList = [];

    if (filter === 'all') {
        filteredList = todoList;
    } else if (filter === 'done') {
        filteredList = todoList.filter(todo => todo.done);
    } else if (filter === 'notdone') {
        filteredList = todoList.filter(todo => !todo.done);
    }

    renderTodos(filteredList);
}



// Привязка функций к кнопкам и событиям

document.getElementById('addTodo').addEventListener('click', addTodo);
document.getElementById('toggleAll').addEventListener('click', toggleAll);
document.getElementById('sortAlpha').addEventListener('click', sortAlpha);
document.getElementById('sortDate').addEventListener('click', sortDate);
document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

// Привязка функции filterTodos к кнопкам фильтрации
document.getElementById('filterAll').addEventListener('click', () => filterTodos('all'));
document.getElementById('filterDone').addEventListener('click', () => filterTodos('done'));
document.getElementById('filterNotDone').addEventListener('click', () => filterTodos('notdone'));

// Вызов функции loadTheme для загрузки сохраненной темы
loadTheme();

// Вызов функции loadTodos для загрузки сохраненных задач
loadTodos();

// Вызов функции renderTodos для отображения задач из todoList
renderTodos();
