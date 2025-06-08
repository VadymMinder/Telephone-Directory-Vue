export class ContactView {
    constructor(contact) {
        this.contact = contact;
    }

    toHtml() {
        return `
            <tr>
                <td>${this.contact.name}</td>
                <td>${this.contact.phone}</td>
                <td>${this.contact.email}</td>
                <td>
                    <button data-id="${this.contact.id}" class="edit-btn btn btn-sm btn-warning me-2">Редагувати</button>
                    <button data-id="${this.contact.id}" class="delete-btn btn btn-sm btn-danger">Видалити</button>
                </td>
            </tr>
        `;
    }
}