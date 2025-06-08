import { User } from './model/User.js';
import { UserView } from './view/UserView.js';
import { UserController } from './controller/UserController.js';

const initialProfileData = new User(
    'Тестове Ім\'я',
    'test@example.com',
    'Чоловіча',
    '1995-10-20'
);

const model = initialProfileData;

const view = new UserView(
    'profile-display-section',
    'profile-edit-form',
    'toggle-profile-edit-btn',
    'save-profile-btn',
    'cancel-edit-btn',
    'logout-btn'
);

const controller = new UserController(model, view);

console.log('Додаток "Профіль Користувача" запущено!')