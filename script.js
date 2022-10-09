const taskInput = document.querySelector('.task-input input'),
filters = document.querySelectorAll('.filters span'),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId, 
isEditTask = false, 
todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTask(btn.id);
    });
});


function showTask(filter) {
    let liTag = '';
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == 'completed' ? 'check' : '';
            if(filter == todos.status || filter == 'all') {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You do not have any task to do</span>`;
    let checkTask = taskBox.querySelectorAll('.task');
    if(!checkTask.length) {
        clearAll.classList.remove('active');
    } else {
        clearAll.classList.add('active');
    }
    
    if(taskBox.offsetHeight >= 300) {
        taskBox.classList.add("overflow")
    } else {
        taskBox.classList.remove("overflow");
    }
}

showTask('all');

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add('checked');
        todos[selectedTask.id].status = 'completed';
    } else {
        taskName.classList.remove('checked');
        todos[selectedTask.id].status = 'completed';
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, taskName) {

}

function deleteTask(deleledId, filter) {
    isEditTask = false;
    todos.splice(deleledId, 1);
    localStorage.setItem('todo-list',JSON.stringify(todos));
    showTask(filter);
}

clearAll.addEventListener('click', () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTask();
});

taskInput.addEventListener('keyup', e => {
    let userTask = taskInput.value.trim();
    if(e.key == 'Enter' && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: 'pending'};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTask(document.querySelector('span.active').id);
    }
});