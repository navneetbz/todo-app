console.log("hello");

let dark = false;

let todoCount = 0;
let completedCount = 0;
let deletedCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    getAllTodos();
    getAllCompletedTodos();
    getAllDeletedTodos();
})
const inputBox = document.getElementById("inputBox");

inputBox.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        createTodo(inputBox.value)
    }
})


async function createTodo(text) {
    const todoText = text ?? inputBox.value;
    if (!todoText) {
        alert("Empty text not allowed!");
        return;
    }

    let reqData = {
        text: todoText,
    };
    try {
        let data = await fetch("/api/todo", {
            body: JSON.stringify(reqData),
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
        });
        data = await data.json();
        console.log("done", data);
        getAllTodos();
    } catch (err) {
        console.log(err);
    }
}


async function getAllCompletedTodos() {
    try {

        let completedTodos = await fetch("/api/todo?isCompleted=true")
        completedTodos = await completedTodos.json();
        const completedTodosList = document.getElementById("completedTodosList");
        completedTodosList.innerHTML = null
        completedCount = completedTodos.data.length
        document.getElementById("completedCount").innerHTML = completedCount;
        completedTodos.data.forEach((el, index) => {
            // <li class="list-group-item">An item</li>

            let listItem = document.createElement("li")
            listItem.classList.add("list-group-item");
            let textNode = document.createTextNode(el.text);
            listItem.appendChild(textNode);
            listItem.classList.add("text-center")
            completedTodosList.appendChild(listItem);

        })


    } catch (err) {
        console.log(err);
    }
}

async function getAllDeletedTodos() {
    try {

        let deletedTodos = await fetch("/api/todo?isDeleted=true")
        deletedTodos = await deletedTodos.json();
        const deletedTodosList = document.getElementById("deletedTodosList");
        deletedTodosList.innerHTML = null
        deletedCount = deletedTodos.data.length
        document.getElementById("deletedCount").innerHTML = deletedCount;
        deletedTodos.data.forEach((el, index) => {
            // <li class="list-group-item">An item</li>

            let listItem = document.createElement("li")
            listItem.classList.add("list-group-item");
            let textNode = document.createTextNode(el.text);
            listItem.appendChild(textNode);
            listItem.classList.add("text-center")
            deletedTodosList.appendChild(listItem);

        })




    } catch (err) {
        console.log(err);
    }
}


async function getAllTodos() {
    try {
        let todos = await fetch("/api/todo?isDeleted=false");
        todos = await todos.json();
        const todoList = document.getElementById("todoList");

        todoList.innerHTML = null
        console.log(todos);
        todoCount = todos.data.length;
        document.getElementById("todoCount").innerHTML = todoCount
        todos.data.forEach((el, index) => {
       
            let listItem = document.createElement("li");
            let labelItem = document.createElement("label");
            let inputItem = document.createElement("input");
            let buttonItem = document.createElement("button");

            buttonItem.classList.add("btn");
            buttonItem.classList.add("btn-outline-danger");
            buttonItem.innerHTML = `<i class="fas fa-close fa-lg fa-fw"></i>`
            buttonItem.setAttribute("onclick", `deleteTodo("${el._id}")`)

            inputItem.classList.add("form-check-input")
            inputItem.classList.add("me-1")
            inputItem.type = "checkbox";
            inputItem.value = "";
            inputItem.setAttribute("onclick", `setChecked("${el._id}")`)
            inputItem.id =`Checkbox${index}`
        
            
            let textNode = document.createTextNode(el.text);
            listItem.classList.add("list-group-item")
            listItem.classList.add("my-list-item")
            labelItem.classList.add("form-check-label");
            labelItem.setAttribute("for",`Checkbox${index}`)
            labelItem.appendChild(textNode);
            labelItem.setAttribute("data-name", `${el._id}`);
            if (el.isCompleted) {
                labelItem.classList.add("crossed")
                inputItem.setAttribute("checked", "true")
            }

            listItem.appendChild(inputItem);
            listItem.appendChild(labelItem);
            listItem.appendChild(buttonItem);
            todoList.appendChild(listItem);
        })

    } catch (err) {
        console.log(err);
    }
}


async function deleteTodo(id) {
    try {
        await fetch(`/api/todo/${id}`, {
            method: "DELETE",
        })
        getAllTodos();

    } catch (err) {
        console.log(err);
    }
}

async function setChecked(id) {
    const item = document.querySelector(`[data-name="${id}"]`);
    let isCrossed  = item.classList.contains("crossed");
    if (isCrossed) {
        
        item.classList.remove("crossed");
        let data = {
            isCompleted : false
        }
        await fetch(`/api/todo/${id}`, {
            method: "PUT",
            body : JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
        })
        getAllCompletedTodos();



    } else {
        item.classList.add("crossed")
        let data = {
            isCompleted : true
        }
        await fetch(`/api/todo/${id}`, {
            method: "PUT",
            body : JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
        })
        getAllCompletedTodos();
    }
    
}

function setTheme() {
    let themeButton = document.getElementById("themeButton");
    if (dark) {
        dark = false;
        document.documentElement.setAttribute("data-bs-theme", "light");
        themeButton.innerHTML = `<i class="fas fa-moon fa-lg fa-fw"></i>`;
    } else {
        dark = true;
        document.documentElement.setAttribute("data-bs-theme", "dark");
        themeButton.innerHTML = `<i class="fas fa-sun fa-lg fa-fw"></i>`;
    }
}
