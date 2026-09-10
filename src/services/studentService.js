// obtener todos los estudiantes
async function getStudents() {
    // marcamos ruta de archivo
    const response = await fetch('src/data/Students.json');
    const data = await response.json();
    return data;
}

// funcion de encontrar DNI
async function findStudentByDni(dni) {

    // llamamos a getStudents
    const students =  await getStudents();

    // usamos el find para devolver la condicion correcta

    const studentFind = students.find(student => student.dni === dni);
    return studentFind;
}

// funcion para el localStorage
// futura evolucion.
function getRegisteredStudents() { 
    return JSON.parse(localStorage.getItem('registeredStudents') || '{}');
}