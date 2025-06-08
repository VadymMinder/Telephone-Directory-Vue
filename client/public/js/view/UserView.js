export class UserView {
    constructor(displaySectionId, formId, editButtonId, saveButtonId, cancelButtonId, logoutButtonId) {
        this.displaySection = document.getElementById(displaySectionId);
        this.profileForm = document.getElementById(formId);
        this.editButton = document.getElementById(editButtonId);
        this.saveButton = document.getElementById(saveButtonId);
        this.cancelButton = document.getElementById(cancelButtonId);
        this.logoutButton = document.getElementById(logoutButtonId);

        // Display elements
        this.displayName = document.getElementById('display-name');
        this.displayEmail = document.getElementById('display-email');
        this.displayGender = document.getElementById('display-gender');
        this.displayDob = document.getElementById('display-dob');

        // Form input elements
        this.formName = document.getElementById('edit-profile-name');
        this.formEmail = document.getElementById('edit-profile-email');
        this.formGender = document.getElementById('edit-profile-gender');
        this.formDob = document.getElementById('edit-profile-dob');

        // Error elements (div.invalid-feedback)
        this.nameError = document.getElementById('edit-profile-name-error');
        this.emailError = document.getElementById('edit-profile-email-error');
        this.genderError = document.getElementById('edit-profile-gender-error');
        this.dobError = document.getElementById('edit-profile-dob-error');

        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.onEditClick = null;
        this.onSaveClick = null;
        this.onCancelClick = null;
        this.onLogoutClick = null;

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.editButton) {
            this.editButton.addEventListener('click', () => {
                this.hideAllErrors();
                if (this.onEditClick) {
                    this.onEditClick();
                }
            });
        }
        if (this.saveButton) {
            this.saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    const newData = {
                        name: this.formName.value.trim(),
                        email: this.formEmail.value.trim(),
                        gender: this.formGender.value,
                        dob: this.formDob.value
                    };
                    if (this.onSaveClick) {
                        this.onSaveClick(newData);
                    }
                }
            });
        }
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideAllErrors();
                if (this.onCancelClick) {
                    this.onCancelClick();
                }
            });
        }
        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', () => {
                if (this.onLogoutClick) {
                    this.onLogoutClick();
                }
            });
        }

        // Validation on blur/input
        this.formName.addEventListener('blur', () => this.validateName());
        this.formName.addEventListener('input', () => this.hideError(this.nameError, this.formName));

        this.formEmail.addEventListener('blur', () => this.validateEmail());
        this.formEmail.addEventListener('input', () => this.hideError(this.emailError, this.formEmail));

        this.formGender.addEventListener('change', () => this.validateGender());
        this.formGender.addEventListener('blur', () => this.validateGender); // Fixed typo

        this.formDob.addEventListener('blur', () => this.validateDob());
        this.formDob.addEventListener('input', () => this.hideError(this.dobError, this.formDob));
    }

    showError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('is-invalid');
    }

    hideError(errorElement, inputElement) {
        errorElement.style.display = 'none';
        inputElement.classList.remove('is-invalid');
    }

    hideAllErrors() {
        this.hideError(this.nameError, this.formName);
        this.hideError(this.emailError, this.formEmail);
        this.hideError(this.genderError, this.formGender);
        this.hideError(this.dobError, this.formDob);
    }

    validateName() {
        const value = this.formName.value.trim();
        if (value === '') {
            this.showError(this.nameError, this.formName, 'Ім\'я не може бути порожнім.');
            return false;
        }
        this.hideError(this.nameError, this.formName);
        return true;
    }

    validateEmail() {
        const value = this.formEmail.value.trim();
        if (value === '') {
            this.showError(this.emailError, this.formEmail, 'Email не може бути порожнім.');
            return false;
        } else if (!this.emailRegex.test(value)) {
            this.showError(this.emailError, this.formEmail, 'Будь ласка, введіть коректний Email.');
            return false;
        }
        this.hideError(this.emailError, this.formEmail);
        return true;
    }

    validateGender() {
        const value = this.formGender.value;
        if (value === '') {
            this.showError(this.genderError, this.formGender, 'Будь ласка, оберіть стать.');
            return false;
        }
        this.hideError(this.genderError, this.formGender);
        return true;
    }

    validateDob() {
        const value = this.formDob.value;
        if (value === '') {
            this.showError(this.dobError, this.formDob, 'Будь ласка, введіть дату народження.');
            return false;
        }
        this.hideError(this.dobError, this.formDob);
        return true;
    }

    validateForm() {
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isGenderValid = this.validateGender();
        const isDobValid = this.validateDob();
        return isNameValid && isEmailValid && isGenderValid && isDobValid;
    }

    render(profileData) {
        this.displayName.textContent = profileData.name || '';
        this.displayEmail.textContent = profileData.email || '';
        this.displayGender.textContent = profileData.gender || '';
        this.displayDob.textContent = profileData.dob || '';

        this.formName.value = profileData.name || '';
        this.formEmail.value = profileData.email || '';
        this.formGender.value = profileData.gender || '';
        this.formDob.value = profileData.dob || '';

        this.hideAllErrors();
    }

    toggleEditMode(isEditing) {
        if (isEditing) {
            this.displaySection.style.display = 'none';
            this.profileForm.style.display = 'block';
            this.editButton.style.display = 'none';
        } else {
            this.displaySection.style.display = 'block';
            this.profileForm.style.display = 'none';
            this.editButton.style.display = 'block';
            this.hideAllErrors();
        }
    }
}