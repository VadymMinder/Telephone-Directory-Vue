document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = 'user@example.com';
    const testPassword = 'password123';

    function showError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('is-invalid');
    }

    function hideError(errorElement, inputElement) {
        errorElement.style.display = 'none';
        inputElement.classList.remove('is-invalid');
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (value === '') {
            showError(emailError, emailInput, 'Email не може бути порожнім.');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailError, emailInput, 'Будь ласка, введіть коректний Email.');
            return false;
        }
        hideError(emailError, emailInput);
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value.trim();
        if (value === '') {
            showError(passwordError, passwordInput, 'Пароль не може бути порожнім.');
            return false;
        }
        hideError(passwordError, passwordInput);
        return true;
    }

    function validateForm() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        return isEmailValid && isPasswordValid;
    }

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => hideError(emailError, emailInput));

    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => hideError(passwordError, passwordInput));

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            if (emailInput.value === testEmail && passwordInput.value === testPassword) {
                alert('Вхід успішний! (тестовий режим)');
                window.location.href = 'profile.html';
            } else {
                alert('Невірний Email або пароль. Спробуйте: user@example.com / password123');
            }
        } else {
            alert('Будь ласка, виправте помилки у формі.');
        }
    });
});