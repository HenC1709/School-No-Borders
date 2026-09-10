const container = document.getElementById('login-container');
const signInBtn = document.getElementById('btn-sign-in');
const signUpBtn = document.getElementById('btn-sign-up');
const darkBtn = document.getElementById('theme-toggle');

signUpBtn.addEventListener('click', function () {
    container.classList.add('active');
});

signInBtn.addEventListener('click', function (
) {
    container.classList.remove('active');
    container.classList.add('was-active');
});

darkBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    const icon = darkBtn.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Login
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dni = document.getElementById('Id-login-number').value;
    const password = document.getElementById('login-password').value;

    const student = await findStudentByDni(dni);

    if (!student) {
        alert('DNI no encontrado.');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    const storedHash = registeredStudents[dni];

    if (!storedHash) {
        alert('Todavía no te registraste. Andá al formulario de registro.');
        return;
    }

    const isMatch = await comparePassword(password, storedHash);

    if (isMatch) {
        alert('Inicio de sesión exitoso.');
    } else {
        alert('Contraseña incorrecta.');
    }
});

// Registro

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dni = document.getElementById('id-register-number').value;
    const password = document.getElementById('register-password').value;

    const student = await findStudentByDni(dni);

    if (!student) {
        alert('DNI no encontrado. Por favor, verifica tu número de DNI.');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    if (registeredStudents[dni]) {
        alert('Ya estás registrado. Por favor, inicia sesión.');
        return;
    }

    const confirmPassword = document.getElementById('confirm-password').value;
    if (!confirmPassword) {
        alert('Por favor, confirma tu contraseña.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const hashedPassword = await hashPassword(password);
    saveRegisteredStudent(dni, hashedPassword);

    alert('Registro exitoso. Ahora puedes iniciar sesión.');
});