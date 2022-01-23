class Task{
    constructor(description){
        var today = new Date();
        if(today.getMinutes() < 10){
            var minutes = '0' + today.getMinutes()
        } else{
            var minutes = today.getMinutes()
        }
        var time = today.getDate() + "/" + (today.getMonth() + 1)+ " - " +  today.getHours() + ":" + minutes;

        this.description = description;
        this.time = time;
    }
}

class UI{
    addTask(task){
        const taskList = document.getElementById('tasks-list');
        const element = document.createElement('div');
        element.className = "draggable";
        element.draggable = true;
        element.innerHTML = `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-8">
                            ${task.description}                    
                        </div>
                        <div class="col-3 text-center">
                            ${task.time}                    
                        </div>
                        <div class="col-1 text-center">
                            <a href="#" class="btn btn-danger" name="delete">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        taskList.appendChild(element);
        
        draggableFunctions();
    }

    resetForm(){
        document.getElementById('task-form').reset();
    }

    deleteTask(element){
        if(element.name === 'delete'){
            element.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            this.showToastr("Task deleted successfully", "success");
        }
        
        const tasksList = document.querySelectorAll('.draggable');
        if(tasksList.length == 0){
            document.getElementById('taskListHeader').style.display = "none";
        }
    }

    showToastr(message, cssClass){
        toastr[cssClass](message);
    }

}

// DOM Events
// DOM Events
// DOM Events

document.getElementById('task-form').addEventListener('submit', function(e){
    
    const tasksList = document.querySelectorAll('.draggable');
    if(tasksList.length == 0){
        document.getElementById('taskListHeader').style.display = "flex";
    }

    const taskDescription =  document.getElementById('taskDescription').value;
    const task = new Task(taskDescription);
    
    const ui = new UI();

    if(taskDescription === ''){
        ui.showToastr("Please add a task description", "warning");
        return;
    } 

    ui.addTask(task);
    ui.resetForm();
    ui.showToastr("Task added successfully", "success");

    e.preventDefault();
})

document.getElementById('tasks-list').addEventListener('click', function(e){
    const ui = new UI()
    ui.deleteTask(e.target);
})

// DRAGGABLE functions
// DRAGGABLE functions
// DRAGGABLE functions
function draggableFunctions() {
        
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('#tasks-list');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        })
    })

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY)
            //console.log(afterElement);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null){
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        })
    })

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if((offset < 0) && (offset > closest.offset)){
                return {offset: offset, element: child}
            } else {
                return closest;
            }

        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
}