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
        showAlert('DNI no encontrado, regístrese para iniciar.');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    const storedHash = registeredStudents[dni];

    if (!storedHash) {
        showAlert('Todavía no te registraste. Andá al formulario de registro.');
        return;
    }

    const isMatch = await comparePassword(password, storedHash);

    if (isMatch) {
        showAlert('Inicio de sesión exitoso.');
    } else {
        showAlert('Contraseña incorrecta.');
    }
});

// Registro

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dni = document.getElementById('id-register-number').value;
    const password = document.getElementById('register-password').value;

    const student = await findStudentByDni(dni);

    if (!student) {
        showAlert('DNI no encontrado. Por favor, verifica tu número de DNI.');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    if (registeredStudents[dni]) {
        showAlert('Ya estás registrado. Por favor, inicia sesión.');
        return;
    }

    const confirmPassword = document.getElementById('confirm-password').value;
    if (!confirmPassword) {
        showAlert('Por favor, confirma tu contraseña.');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden.');
        return;
    }

    const hashedPassword = await hashPassword(password);
    saveRegisteredStudent(dni, hashedPassword);

    showAlert('Registro exitoso. Ahora puedes iniciar sesión.');
});

// Funcion de mensaje de alerta, no usamos alerta del navegador
function showAlert(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-overlay').classList.add('active');
}

const okButton = document.getElementById('modal-ok-button');
okButton.addEventListener('click', function () {
    document.getElementById('modal-overlay').classList.remove('active');
});