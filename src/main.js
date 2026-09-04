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