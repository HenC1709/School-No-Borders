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
        showAlert('DNI not found, please register to login.', 'error');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    const storedHash = registeredStudents[dni];

    if (!storedHash) {
        showAlert('you are not register yet: go to the form', 'error');
        return;
    }

    const isMatch = await comparePassword(password, storedHash);

    if (isMatch) {
        showAlert('Successful login', 'success');
    } else {
        showAlert('Incorrect Password', 'error');
    }
});

// Registro

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dni = document.getElementById('id-register-number').value;
    const password = document.getElementById('register-password').value;

    const student = await findStudentByDni(dni);

    if (!student) {
        showAlert('DNI not found. Please, Check your ID Number', 'error');
        return;
    }

    const registeredStudents = getRegisteredStudents();
    if (registeredStudents[dni]) {
        showAlert('You was register. Please, Sign up', 'error');
        return;
    }

    const confirmPassword = document.getElementById('confirm-password').value;
    if (!confirmPassword) {
        showAlert('Please, confirm your password', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('The passwords do not match.', 'error');
        return;
    }

    const hashedPassword = await hashPassword(password);
    saveRegisteredStudent(dni, hashedPassword);

    showAlert('Successful register. now you can sign up', 'success');
});

// Funcion de mensaje de alerta, no usamos alerta del navegador
function showAlert(message, type) {
    document.getElementById('modal-message').textContent = message;
   
   if (type === 'error') { 
    document.getElementById('modal-overlay').classList.add('error');
   } else { 
    document.getElementById('modal-overlay').classList.add('success');
   }

   document.getElementById('modal-overlay').classList.add('active');
}

const okButton = document.getElementById('modal-ok-button');
okButton.addEventListener('click', function () {
    document.getElementById('modal-overlay').classList.remove('error');
    document.getElementById('modal-overlay').classList.remove('success');
    document.getElementById('modal-overlay').classList.remove('active');
});