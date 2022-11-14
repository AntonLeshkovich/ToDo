const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
     //формируем CSS класс 
     const cssClass = task.done ? "task-title task-title--done" : "task-title ";

     //формируем разметку для новой задачи
     const taskHTML = `
     <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
         <span class="${cssClass}">${task.text}</span>
         <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
                 <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
                 <img src="./img/cross.svg" alt="Done" width="18" height="18">
             </button>
         </div>
     </li>`;
 
     //добавляем введённую задачу на страницу
     tasksList.insertAdjacentHTML('beforeend', taskHTML);
})

checkEmptyList();

//добавление задачи
form.addEventListener('submit', addTask);

//удаление задачи
tasksList.addEventListener('click', deleteTask);

//отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

//функции
function addTask(e) {
    //отменяем заданную по умолчанию отправку формы
    e.preventDefault();

    //достаём введенный текст из поля ввода
    const taskText = taskInput.value;

    //описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    //добавляем задачу в массив с задачами
    tasks.push(newTask);
   
    //сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();
    
    //формируем CSS класс 
    const cssClass = newTask.done ? "task-title task-title--done" : "task-title ";

    //формируем разметку для новой задачи
    const taskHTML = `
    <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${newTask.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;

    //добавляем введённую задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    //очищаем поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(e) {
    //проверяем что клик был НЕ по кнопке "удалить задачу"
    if (e.target.dataset.action !== 'delete') return;

    //проверяем что клик был по кнопке "удалить задачу"
    const parentNode = e.target.closest('.list-group-item');

    //определяем ID задачи
    const id = +parentNode.id;

    //удаляем задачу из массива через фильтрацию 
    tasks = tasks.filter((task) => task.id !== id);

    //сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    //удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
}

function doneTask(e) {
    //проверяем что клик был НЕ по кнопке "задача выполнена" 
    if (e.target.dataset.action !== 'done') return;

    const parentNode = e.target.closest('.list-group-item');
    
    //определяем ID задачи
    const id = +parentNode.id;
    const task = tasks.find(function(task) {
        if (task.id === id) {
            return true;
        }
    })
    task.done = !task.done;

    //сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
		</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}