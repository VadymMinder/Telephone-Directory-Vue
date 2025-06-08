import { ContactListModel } from './model/ContactListModel.js';
import { ContactListView } from './view/ContactListView.js';
import { AppController } from './controller/AppController.js';
import { Contact } from './model/Contact.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialContacts = [
        new Contact('1', 'Олена Коваль', '+380 97 123 4567', 'olena.koval@example.com'),
        new Contact('2', 'Андрій Бондаренко', '+380 50 987 6543', 'andriy.b@example.com'),
        new Contact('3', 'Марина Соловйова', '+380 63 111 2233', 'maryna.s@example.com')
    ];
    const model = new ContactListModel(initialContacts);

    const view = new ContactListView('phone-book-app', 'contact-form');

    const controller = new AppController(model, view);

    console.log('Додаток "Телефонний Довідник" запущено!');
});