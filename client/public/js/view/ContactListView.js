import { ContactView } from './ContactView.js';

export class ContactListView {
    constructor(appElementId, formElementId) {
        this.appElement = document.getElementById(appElementId);
        this.formElement = document.getElementById(formElementId);
        this.contactListContainer = this.appElement.querySelector('tbody');
        this.addContactButton = this.formElement.querySelector('.add-contact-btn');
        this.nameInput = this.formElement.querySelector('#contact-name');
        this.phoneInput = this.formElement.querySelector('#contact-phone');
        this.emailInput = this.formElement.querySelector('#contact-email');
        this.contactIdInput = this.formElement.querySelector('#contact-id');

        this.nameError = this.formElement.querySelector('#name-error');
        this.phoneError = this.formElement.querySelector('#phone-error');
        this.emailError = this.formElement.querySelector('#email-error');

        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phoneRegex = /^\+?[\d\s()-]{7,20}$/;
        this.maxLengths = {
            name: 50,
            phone: 20,
            email: 100,
        };

        this.searchInput = this.appElement.querySelector('#search-input');
        this.searchButton = this.appElement.querySelector('#search-button');
        this.groupSortButton = this.appElement.querySelector('#group-sort-button');

        this.onAddContact = null;
        this.onDeleteContact = null;
        this.onEditContact = null;
        this.onSaveEditedContact = null;
        this.onSearchContacts = null;
        this.onToggleGroupSort = null;

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.addContactButton) {
            this.addContactButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    const id = this.contactIdInput.value || Date.now().toString();
                    const name = this.nameInput.value;
                    const phone = this.phoneInput.value;
                    const email = this.emailInput.value;

                    if (this.contactIdInput.value) {
                        if (this.onSaveEditedContact) {
                            this.onSaveEditedContact(id, name, phone, email);
                        }
                    } else {
                            if (this.onAddContact) {
                                this.onAddContact(id, name, phone, email);
                            }
                        }
                        this.clearForm();
                    }
                });
            }

            if (this.contactListContainer) {
                this.contactListContainer.addEventListener('click', (e) => {
                    const target = e.target;
                    if (target.classList.contains('delete-btn')) {
                        const id = target.dataset.id;
                        if (confirm('Ви впевнені, що хочете видалити цей контакт?')) {
                            if (this.onDeleteContact) {
                                this.onDeleteContact(id);
                            }
                        }
                    } else if (target.classList.contains('edit-btn')) {
                        const id = target.dataset.id;
                        this.hideAllErrors();
                        if (this.onEditContact) {
                            this.onEditContact(id);
                        }
                    }
                });
            }

            if (this.searchButton) {
                this.searchButton.addEventListener('click', () => {
                    const query = this.searchInput.value.trim();
                    if (this.onSearchContacts) {
                        this.onSearchContacts(query);
                    }
                });
            }

            if (this.searchInput) {
                this.searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const query = this.searchInput.value.trim();
                        if (this.onSearchContacts) {
                            this.onSearchContacts(query);
                        }
                    }
                });
            }

            if (this.groupSortButton) {
                this.groupSortButton.addEventListener('click', () => {
                    if (this.onToggleGroupSort) {
                        this.onToggleGroupSort();
                    }
                });
            }

            this.nameInput.addEventListener('blur', () => this.validateName());
            this.nameInput.addEventListener('input', () => this.hideError(this.nameError, this.nameInput));

            this.phoneInput.addEventListener('blur', () => this.validatePhone());
            this.phoneInput.addEventListener('input', () => this.hideError(this.phoneError, this.phoneInput));

            this.emailInput.addEventListener('blur', () => this.validateEmail());
            this.emailInput.addEventListener('input', () => this.hideError(this.emailError, this.emailInput));
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
        this.hideError(this.nameError, this.nameInput);
        this.hideError(this.phoneError, this.phoneInput);
        this.hideError(this.emailError, this.emailInput);
    }

    validateName() {
        const nameValue = this.nameInput.value.trim();
        if (nameValue === '') {
            this.showError(this.nameError, this.nameInput, 'Будь ласка, введіть ім\'я.');
            return false;
        } else if (nameValue.length > this.maxLengths.name) {
            this.showError(this.nameError, this.nameInput, `Максимальна довжина ${this.maxLengths.name} символів.`);
            return false;
        }
        this.hideError(this.nameError, this.nameInput);
        return true;
    }

    validatePhone() {
        const phoneValue = this.phoneInput.value.trim();
        if (phoneValue === '') {
            this.showError(this.phoneError, this.phoneInput, 'Будь ласка, введіть номер телефону.');
            return false;
        } else if (!this.phoneRegex.test(phoneValue)) {
            this.showError(this.phoneError, this.phoneInput, 'Будь ласка, введіть коректний номер телефону (мін. 7, макс. 20 символів; включаючи +, пробіли, дужки, дефіси).');
            return false;
        } else if (phoneValue.length > this.maxLengths.phone) {
            this.showError(this.phoneError, this.phoneInput, `Максимальна довжина ${this.maxLengths.phone} символів.`);
            return false;
        }
        this.hideError(this.phoneError, this.phoneInput);
        return true;
    }

    validateEmail() {
        const emailValue = this.emailInput.value.trim();
        if (emailValue === '') {
            this.showError(this.emailError, this.emailInput, 'Будь ласка, введіть Email.');
            return false;
        } else if (!this.emailRegex.test(emailValue)) {
            this.showError(this.emailError, this.emailInput, 'Будь ласка, введіть коректний Email.');
            return false;
        } else if (emailValue.length > this.maxLengths.email) {
            this.showError(this.emailError, this.emailInput, `Максимальна довжина ${this.maxLengths.email} символів.`);
            return false;
        }
        this.hideError(this.emailError, this.emailInput);
        return true;
    }

    validateForm() {
        const isNameValid = this.validateName();
        const isPhoneValid = this.validatePhone();
        const isEmailValid = this.validateEmail();

        return isNameValid && isPhoneValid && isEmailValid;
    }

    // ОНОВЛЕНО: Render для відображення груп та зміни кнопки
    render(contacts, isGroupedAndSorted) {
        if (this.contactListContainer) {
            this.contactListContainer.innerHTML = '';
            if (contacts.length === 0) {
                this.contactListContainer.innerHTML = '<tr><td colspan="4" class="text-center py-3 text-muted">Поки що немає контактів. Додайте перший!</td></tr>';
                return;
            }

            contacts.forEach(item => {
                if (item.isGroupHeader) {
                    this.contactListContainer.innerHTML += `
                        <tr class="table-info">
                            <td colspan="4" class="text-start fs-5 fw-bold py-2">${item.letter}</td>
                        </tr>
                    `;
                } else {
                    const contactView = new ContactView(item);
                    this.contactListContainer.innerHTML += contactView.toHtml();
                }
            });

            // ОНОВЛЕНО: Зміна тексту та класу кнопки
            if (isGroupedAndSorted) {
                this.groupSortButton.textContent = 'Скасувати групування';
                this.groupSortButton.classList.remove('btn-secondary');
                this.groupSortButton.classList.add('btn-danger');
            } else {
                this.groupSortButton.textContent = 'Групувати та Сортувати';
                this.groupSortButton.classList.remove('btn-danger');
                this.groupSortButton.classList.add('btn-secondary');
            }
        }
    }

    fillFormForEdit(contact) {
        if (contact) {
            this.contactIdInput.value = contact.id;
            this.nameInput.value = contact.name;
            this.phoneInput.value = contact.phone;
            this.emailInput.value = contact.email;
            this.addContactButton.textContent = 'Зберегти зміни';
            this.addContactButton.classList.remove('btn-success');
            this.addContactButton.classList.add('btn-primary');
        }
    }

    clearForm() {
        this.contactIdInput.value = '';
        this.nameInput.value = '';
        this.phoneInput.value = '';
        this.emailInput.value = '';
        this.addContactButton.textContent = 'Додати Контакт';
        this.addContactButton.classList.remove('btn-primary');
        this.addContactButton.classList.add('btn-success');
        this.hideAllErrors();
    }
}