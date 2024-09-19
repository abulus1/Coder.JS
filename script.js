//------------------Arreglo------------------
const tarea = [];
//------------------Funciones------------------
const AgregarTarea = () =>{
   let nuevaTarea = prompt("indique el nombre de la tarea a agregar").toLowerCase();
   if(nuevaTarea){
   tarea.push(nuevaTarea)
   alert ("Se agrego una nueva tarea llamada \n"+ nuevaTarea)
   }else{
    alert("no se puede agregar un valor nulo")
   }
   console.log(tarea)
}
const EliminarTarea = () =>{
    let confirmacion = confirm("Estas seguro de que desea eliminar una tarea?")
    if(confirmacion){
        let i = parseInt(prompt("ingrese el numero de la tarea a eliminar"))-1
        if( i >= 0 && i < tarea.length) {
        tarea.splice(i,1)
        alert("Tarea eliminada")
        }else{
            alert("Numero de tarea invalido")
        }
    }else {
        alert("No se elimino ninguna tarea")
    }
    console.log(tarea)
}
const EditarTarea = () => {
    let confirmacion = confirm("Estas seguro de que desea editar una tarea?")
    if(confirmacion){
        let i = parseInt(prompt("ingrese el numero de la tarea a editar"))-1
        if( i >= 0 && i < tarea.length) {
        let tareaEditada = prompt("ingrese el nuevo nombre para la tarea a editar")
        tarea [i] = tareaEditada 
        alert("Tarea editada")
        }else{
            alert("Numero de tarea invalido")
        }
   console.log(tarea)
    }
}
let continuar = true;

while (continuar) {
    let seleccion = prompt("¿Quiere agregar, editar, eliminar o mostrar una tarea? Escriba 'salir' para terminar.").toLowerCase();

    switch (seleccion) {
        case "agregar":
            AgregarTarea();
            break;
        case "eliminar":
            EliminarTarea();
            break;
        case "editar":
            EditarTarea();
            break;
        case "mostrar":
            alert(tarea);
            break;
        case "salir":
            continuar = false;  
            alert("Saliendo...");
            break;
        default:
            alert("Opción no válida. Intente de nuevo.");
    }
}