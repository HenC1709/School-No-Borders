const container = document.getElementById('login-container');
const signInBtn = document.getElementById('btn-sign-in');
const signUpBtn = document.getElementById('btn-sign-up');

signUpBtn.addEventListener('click', function () {
    container.classList.add('active');
});

signInBtn.addEventListener('click', function (
) {
    container.classList.remove('active');
    container.classList.add('was-active');
});