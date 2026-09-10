async function getStudents() {
    const response = await fetch('src/data/Students.json');
    const data = await response.json();
    return data;
}