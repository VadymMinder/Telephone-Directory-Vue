export class UserController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);

        this.model.setOnChangeCallback(this.handleModelChange);

        this.view.onEditClick = this.handleEditClick;
        this.view.onSaveClick = this.handleSaveClick;
        this.view.onCancelClick = this.handleCancelClick;
        this.view.onLogoutClick = this.handleLogoutClick;

        this.view.render(this.model.getProfile());
        this.view.toggleEditMode(false);
    }

    handleModelChange(profileData) {
        this.view.render(profileData);
    }

    handleEditClick() {
        this.view.render(this.model.getProfile());
        this.view.toggleEditMode(true);
    }

    handleSaveClick(newData) {
        this.model.update(newData);
        this.view.toggleEditMode(false);
    }

    handleCancelClick() {
        this.view.render(this.model.getProfile());
        this.view.toggleEditMode(false);
    }

    handleLogoutClick() {
        alert('Ви вийшли з системи (ЛР2).');
        window.location.href = 'login.html';
    }
}