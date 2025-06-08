import { Contact } from '../model/Contact.js';
import { ContactListModel } from '../model/ContactListModel.js';
import { ContactListView } from '../view/ContactListView.js';

export class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.onContactListChanged = this.onContactListChanged.bind(this);
        this.handleAddContact = this.handleAddContact.bind(this);
        this.handleDeleteContact = this.handleDeleteContact.bind(this);
        this.handleEditContact = this.handleEditContact.bind(this);
        this.handleSaveEditedContact = this.handleSaveEditedContact.bind(this);
        this.handleSearchContacts = this.handleSearchContacts.bind(this);
        this.onContactChanged = this.onContactChanged.bind(this);
        this.handleToggleGroupSort = this.handleToggleGroupSort.bind(this);

        this.model.setOnListChangeCallback(this.onContactListChanged);

        this.view.onAddContact = this.handleAddContact;
        this.view.onDeleteContact = this.handleDeleteContact;
        this.view.onEditContact = this.handleEditContact;
        this.view.onSaveEditedContact = this.handleSaveEditedContact;
        this.view.onSearchContacts = this.handleSearchContacts;
        this.view.onToggleGroupSort = this.handleToggleGroupSort;

        this.onContactListChanged(this.model.getContacts(), this.model.isGroupedAndSorted);
    }

    onContactListChanged(contacts, isGroupedAndSorted) {
        this.view.render(contacts, isGroupedAndSorted);
    }

    handleAddContact(id, name, phone, email) {
        const newContact = new Contact(id, name, phone, email);
        newContact.setOnChangeCallback(this.onContactChanged);
        this.model.addContact(newContact);
    }

    handleDeleteContact(id) {
        this.model.removeContact(id);
    }

    handleEditContact(id) {
        const contactToEdit = this.model.getAllContacts().find(c => c.id === id);
        if (contactToEdit) {
            this.view.fillFormForEdit(contactToEdit);
        }
    }

    handleSaveEditedContact(id, name, phone, email) {
        const contactToUpdate = this.model.getAllContacts().find(c => c.id === id);
        if (contactToUpdate) {
            contactToUpdate.name = name;
            contactToUpdate.phone = phone;
            contactToUpdate.email = email;
            this.model.updateContact(contactToUpdate);
        }
    }

    handleSearchContacts(query) {
        this.model.searchContacts(query);
    }

    handleToggleGroupSort() {
        this.model.toggleGroupSort();
    }

    onContactChanged(contact) {
        console.log(`Контакт змінено: ${contact.name}`);
    }
}