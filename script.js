//------------------Arreglo------------------
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

//------------------Funciones------------------
const renderTareas = () => {
    const listaTareas = document.getElementById('lista-tareas');
    listaTareas.innerHTML = ''; 

    tareas.forEach((tarea, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${tarea}`;
        
     
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            EliminarTarea(index);
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            EditarTarea(index);
        });

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        listaTareas.appendChild(li);
    });
};

const AgregarTarea = () => {
    const nuevaTarea = document.getElementById('nueva-tarea').value.toLowerCase();
    if (nuevaTarea) {
        tareas.push(nuevaTarea);
        localStorage.setItem('tareas', JSON.stringify(tareas)); 
        alert("Se agregó una nueva tarea: " + nuevaTarea);
        renderTareas();
    } else {
        alert("No se puede agregar un valor nulo");
    }
    document.getElementById('nueva-tarea').value = ''; 
};

const EliminarTarea = (index) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        tareas.splice(index, 1);
        localStorage.setItem('tareas', JSON.stringify(tareas)); 
        alert("Tarea eliminada");
        renderTareas();
    }
};

const EditarTarea = (index) => {
    const nuevaDescripcion = prompt("Ingrese el nuevo nombre para la tarea", tareas[index]);
    if (nuevaDescripcion) {
        tareas[index] = nuevaDescripcion;
        localStorage.setItem('tareas', JSON.stringify(tareas)); 
        alert("Tarea editada");
        renderTareas();
    } else {
        alert("No se puede ingresar un valor nulo");
    }
};

document.getElementById('agregar-tarea').addEventListener('click', AgregarTarea);


window.addEventListener('load', renderTareas);
