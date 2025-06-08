// lr2-bootstrap-js-mvc/js/registration-validation.js

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const genderSelect = document.getElementById('gender');
    const dobInput = document.getElementById('dob');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const genderError = document.getElementById('gender-error');
    const dobError = document.getElementById('dob-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 6;

    function showError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('is-invalid');
    }

    function hideError(errorElement, inputElement) {
        errorElement.style.display = 'none';
        inputElement.classList.remove('is-invalid');
    }

    function validateName() {
        const value = nameInput.value.trim();
        if (value === '') {
            showError(nameError, nameInput, 'Будь ласка, введіть ім\'я.');
            return false;
        }
        hideError(nameError, nameInput);
        return true;
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
        } else if (value.length < passwordMinLength) {
            showError(passwordError, passwordInput, `Пароль повинен містити не менше ${passwordMinLength} символів.`);
            return false;
        }
        hideError(passwordError, passwordInput);
        return true;
    }

    function validateGender() {
        const value = genderSelect.value;
        if (value === '') {
            showError(genderError, genderSelect, 'Будь ласка, оберіть стать.');
            return false;
        }
        hideError(genderError, genderSelect);
        return true;
    }

    function validateDob() {
        const value = dobInput.value;
        if (value === '') {
            showError(dobError, dobInput, 'Будь ласка, введіть дату народження.');
            return false;
        }
        hideError(dobError, dobInput);
        return true;
    }

    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isGenderValid = validateGender();
        const isDobValid = validateDob();

        return isNameValid && isEmailValid && isPasswordValid && isGenderValid && isDobValid;
    }

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    genderSelect.addEventListener('change', validateGender);
    dobInput.addEventListener('blur', validateDob);

    nameInput.addEventListener('input', () => hideError(nameError, nameInput));
    emailInput.addEventListener('input', () => hideError(emailError, emailInput));
    passwordInput.addEventListener('input', () => hideError(passwordError, passwordInput));
    dobInput.addEventListener('input', () => hideError(dobError, dobInput));

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            alert('Реєстрація успішна! (дані не зберігаються)');
            registrationForm.reset();
            window.location.href = 'login.html';
        } else {
            alert('Будь ласка, виправте помилки у формі.');
        }
    });
});