let tareas = [];
let terminoBusqueda = '';
let filtroEstado = 'todas';
const usuarios = [
    { username: 'Agustin', password: '1234' },
    { username: 'coderhouse', password: 'cracks' }
];
// Cargar Tareas desde JSON al iniciar
const cargarTareasDesdeJSON = async () => {
    try {
        const response = await fetch('tareas.json');
        tareas = await response.json();
        renderTareas();
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
};
document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usuario = usuarios.find(u => u.username === username && u.password === password);
    if (usuario) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('todo-container').style.display = 'block';
        cargarTareasDesdeJSON(); // Cargar tareas después del inicio de sesión
    } else {
        document.getElementById('login-error').innerText = 'Usuario o contraseña incorrectos';
    }
});
// Guardar tareas en JSON (esto requiere un backend)
const guardarTareasEnJSON = async () => {
    try {
        await fetch('tareas.json', {
            method: 'PUT', // Cambiar a POST o PUT según tu API
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareas)
        });
    } catch (error) {
        console.error('Error al guardar tareas:', error);
    }
};

// Renderizar Tareas
const renderTareas = () => {
    const listaTareas = document.getElementById('lista-tareas');
    listaTareas.innerHTML = '';

    // Filtrar tareas por búsqueda y estado
    const tareasFiltradas = tareas.filter(tarea => {
        const nombreMatch = tarea.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
        const descripcionMatch = tarea.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase());
        const cumpleBusqueda = nombreMatch || descripcionMatch;
        const cumpleEstado = (filtroEstado === 'todas') ||
                             (filtroEstado === 'completadas' && tarea.completada) ||
                             (filtroEstado === 'pendientes' && !tarea.completada);
        return cumpleBusqueda && cumpleEstado;
    });

    tareasFiltradas.forEach((tarea, index) => {
        const li = document.createElement('li');
        li.classList.add('tarea-item');
        if (tarea.completada) li.classList.add('completada'); // Clase para tareas completadas

        li.innerHTML = `
            <strong>${index + 1}. ${tarea.nombre}</strong> 
            <p>Descripción: ${tarea.descripcion}</p>
            <p>Fecha de vencimiento: ${tarea.fecha}</p>
            <p>Prioridad: ${tarea.prioridad}</p>
            <p>Estado: ${tarea.completada ? 'Completada' : 'Pendiente'}</p>
        `;

        const botonesDiv = document.createElement('div');
        botonesDiv.style.display = 'flex';
        botonesDiv.style.justifyContent = 'space-between';
        botonesDiv.style.marginTop = '10px';

        // Botón de Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => abrirModalEdicion(index));

        // Botón de Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => abrirModalConfirmacion("¿Estás seguro de que deseas eliminar esta tarea?", () => {
            EliminarTarea(index, li);
        }));

        // Botón de Marcar como Completada/Pendiente
        const toggleButton = document.createElement('button');
        toggleButton.textContent = tarea.completada ? 'Marcar como Pendiente' : 'Marcar como Completada';
        toggleButton.addEventListener('click', () => {
            tarea.completada = !tarea.completada;
            guardarTareasEnJSON(); // Guardar en JSON
            renderTareas();
        });

        botonesDiv.appendChild(editButton);
        botonesDiv.appendChild(toggleButton);
        botonesDiv.appendChild(deleteButton);
        li.appendChild(botonesDiv);
        listaTareas.appendChild(li);

        // Animación de aparición para cada tarea
        gsap.from(li, { duration: 0.5, opacity: 0, y: -20 });
    });
};

// Agregar Tarea
const AgregarTarea = () => {
    const nombreTarea = document.getElementById('nueva-tarea').value.trim();
    const descripcion = document.getElementById('descripcion-tarea').value.trim();
    const fecha = document.getElementById('fecha-tarea').value;
    const prioridad = document.getElementById('prioridad-tarea').value;

    if (nombreTarea && descripcion && fecha && prioridad) {
        const nuevaTarea = { nombre: nombreTarea, descripcion, fecha, prioridad, completada: false };
        tareas.push(nuevaTarea);
        guardarTareasEnJSON(); // Guardar en JSON

        // Mensaje de éxito
        Swal.fire('Tarea Agregada', `Se agregó una nueva tarea: ${nombreTarea}`, 'success');
        
        renderTareas();

        // Limpiamos los campos después de agregar la tarea
        document.getElementById('nueva-tarea').value = '';
        document.getElementById('descripcion-tarea').value = '';
        document.getElementById('fecha-tarea').value = '';
        document.getElementById('prioridad-tarea').value = 'Baja';
    } else {
        // Mensaje de advertencia si falta algún campo
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'warning');
    }
};

// Eliminar Tarea
const EliminarTarea = (index, tareaElement) => {
    gsap.to(tareaElement, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        onComplete: () => {
            tareas.splice(index, 1);
            guardarTareasEnJSON(); // Guardar en JSON
            renderTareas();
            Swal.fire('Tarea Eliminada', 'La tarea ha sido eliminada exitosamente.', 'success');
        }
    });
};

// Editar Tarea
const EditarTarea = (index, nombre, descripcion, fecha, prioridad) => {
    if (nombre && descripcion && fecha && prioridad) {
        tareas[index] = { ...tareas[index], nombre, descripcion, fecha, prioridad };
        guardarTareasEnJSON(); // Guardar en JSON
        Swal.fire('Tarea Editada', 'La tarea ha sido editada exitosamente.', 'success');
        renderTareas();
    } else {
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'warning');
    }
};

// Modal de Confirmación
const abrirModalConfirmacion = (mensaje, onConfirm) => {
    Swal.fire({
        title: 'Confirmación',
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

// Modal de Edición
const abrirModalEdicion = (index) => {
    const tarea = tareas[index];
    Swal.fire({
        title: 'Editar Tarea',
        html: `
            <label>Nombre de la tarea:</label>
            <input type="text" id="edit-nombre-tarea" value="${tarea.nombre}" class="swal2-input">
            <label>Descripción:</label>
            <input type="text" id="edit-descripcion-tarea" value="${tarea.descripcion}" class="swal2-input">
            <label>Fecha de vencimiento:</label>
            <input type="date" id="edit-fecha-tarea" value="${tarea.fecha}" class="swal2-input">
            <label>Prioridad:</label>
            <select id="edit-prioridad-tarea" class="swal2-select">
                <option ${tarea.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                <option ${tarea.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                <option ${tarea.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('edit-nombre-tarea').value.trim();
            const descripcion = document.getElementById('edit-descripcion-tarea').value.trim();
            const fecha = document.getElementById('edit-fecha-tarea').value;
            const prioridad = document.getElementById('edit-prioridad-tarea').value;
            if (!nombre || !descripcion || !fecha || !prioridad) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            EditarTarea(index, nombre, descripcion, fecha, prioridad);
        }
    });
};

// Filtrar Tareas
const manejarFiltroEstado = (estado) => {
    filtroEstado = estado;
    renderTareas();
};

// Buscar Tareas
const manejarBusqueda = (event) => {
    terminoBusqueda = event.target.value.trim();
    renderTareas();
};

// Event Listeners
document.getElementById('agregar-tarea').addEventListener('click', AgregarTarea);
document.getElementById('buscar-tarea').addEventListener('input', manejarBusqueda);
document.getElementById('filtro-todas').addEventListener('click', () => manejarFiltroEstado('todas'));
document.getElementById('filtro-completadas').addEventListener('click', () => manejarFiltroEstado('completadas'));
document.getElementById('filtro-pendientes').addEventListener('click', () => manejarFiltroEstado('pendientes'));

// Render Inicial
window.addEventListener('load', cargarTareasDesdeJSON);
window.addEventListener('load', () => {
    document.getElementById('todo-container').style.display = 'none'; // Ocultar el contenedor de tareas
});
