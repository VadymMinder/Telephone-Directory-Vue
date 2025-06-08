export class ContactListModel {
    constructor(contacts = []) {
        this.contacts = contacts;
        this.allContacts = [...contacts];
        this.onListChangeCallback = null;
        this.isGroupedAndSorted = false;
    }

    setOnListChangeCallback(callback) {
        this.onListChangeCallback = callback;
    }

    _notifyListChange() {
        if (this.onListChangeCallback) {
            this.onListChangeCallback([...this.contacts], this.isGroupedAndSorted);
        }
    }

    addContact(contact) {
        this.allContacts.push(contact);
        if (!this.isGroupedAndSorted) {
            this.contacts.push(contact);
        } else {
            this.toggleGroupSort();
        }
        this._notifyListChange();
    }

    removeContact(id) {
        this.allContacts = this.allContacts.filter(contact => contact.id !== id);
        if (!this.isGroupedAndSorted) {
            this.contacts = this.contacts.filter(contact => contact.id !== id);
        } else {
            this.toggleGroupSort();
        }
        this._notifyListChange();
    }

    updateContact(updatedContact) {
        this.allContacts = this.allContacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact
        );
        if (!this.isGroupedAndSorted) {
            this.contacts = this.contacts.map(contact =>
                contact.id === updatedContact.id ? updatedContact : contact
            );
        } else {
            this.toggleGroupSort();
        }
        this._notifyListChange();
    }

    getContacts() {
        return this.contacts;
    }

    getAllContacts() {
        return this.allContacts;
    }

    searchContacts(query) {
        const lowerCaseQuery = query.toLowerCase();
        if (lowerCaseQuery === '') {
            this.contacts = [...this.allContacts];
        } else {
            this.contacts = this.allContacts.filter(contact =>
                contact.name.toLowerCase().includes(lowerCaseQuery) ||
                contact.phone.toLowerCase().includes(lowerCaseQuery) ||
                contact.email.toLowerCase().includes(lowerCaseQuery)
            );
        }
        this.isGroupedAndSorted = false;
        this._notifyListChange();
    }

    groupAndSortContacts() {
        const sorted = [...this.allContacts].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        const grouped = {};
        sorted.forEach(contact => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(contact);
        });

        const result = [];
        Object.keys(grouped).sort().forEach(letter => {
            result.push({ isGroupHeader: true, letter: letter });
            grouped[letter].forEach(contact => result.push(contact));
        });

        this.contacts = result;
        this.isGroupedAndSorted = true;
        this._notifyListChange();
    }

    toggleGroupSort() {
        if (this.isGroupedAndSorted) {
            this.contacts = [...this.allContacts];
            this.isGroupedAndSorted = false;
        } else {
            this.groupAndSortContacts();
        }
        this._notifyListChange();
    }
}