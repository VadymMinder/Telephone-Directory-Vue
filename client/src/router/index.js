// lr3-bootstrap-fullstack/client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Створимо цей компонент пізніше
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import About from '../views/About.vue';
import PhoneBook from '../views/PhoneBook.vue'; // Ваш PhoneBook.vue буде маршрутом

const routes = [
    { path: '/', name: 'HomePage', component: Home },
    { path: '/register', name: 'RegisterPage', component: Register },
    { path: '/login', name: 'LoginPage', component: Login },
    { path: '/profile', name: 'ProfilePage', component: Profile },
    { path: '/about', name: 'AboutPage', component: About },
    { path: '/app', name: 'PhoneBookPage', component: PhoneBook }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (to.meta.requiresGuest && isLoggedIn) {
        next('/profile');
    }
    else if (to.meta.requiresAuth && !isLoggedIn) {
        alert('Будь ласка, увійдіть до системи, щоб отримати доступ до цієї сторінки.');
        next('/login');
    }
    else {
        next();
    }
});

export default router;