<template>
    <div class="d-flex flex-column flex-grow-1">
        <main class="flex-grow-1 container my-4 p-4 bg-white rounded shadow-sm" style="max-width: 500px;">
            <h2 class="h4 text-center mb-4 text-primary">Вхід до Акаунту</h2>

            <div v-if="isLoggedIn" class="alert alert-info text-center" role="alert">
                Ви вже увійшли до акаунту!
                <router-link to="/profile" class="alert-link">Перейти до профілю</router-link>.
            </div>

            <form v-else @submit.prevent="loginUser">
                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" id="email" class="form-control" :class="{'is-invalid': errors.email}" v-model.trim="user.email" @blur="validateField('email')" required>
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Пароль:</label>
                    <input type="password" id="password" class="form-control" :class="{'is-invalid': errors.password}" v-model.trim="user.password" @blur="validateField('password')" required>
                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Увійти</button>
            </form>
        </main>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'LoginPage',
        data() {
            return {
                user: {
                    email: '',
                    password: '',
                },
                errors: {
                    email: '',
                    password: '',
                },
                emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                isLoggedIn: false,
            };
        },
        created() {
            this.checkLoginStatus();
        },
        methods: {
            checkLoginStatus() {
                this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            },
            validateField(field) {
                let isValid = true;
                this.errors[field] = '';

                const value = this.user[field];

                if (value === '' || value === null || value === undefined) {
                    this.errors[field] = 'Це поле не може бути порожнім.';
                    isValid = false;
                } else if (field === 'email' && !this.emailRegex.test(value)) {
                    this.errors[field] = 'Будь ласка, введіть коректний Email.';
                    isValid = false;
                }
                return isValid;
            },
            validateForm() {
                let isFormValid = true;
                for (const field of ['email', 'password']) {
                    if (!this.validateField(field)) {
                        isFormValid = false;
                    }
                }
                return isFormValid;
            },
            async loginUser() {
                if (this.validateForm()) {
                    try {
                        const response = await axios.post('http://localhost:3000/api/login', this.user);
                        console.log('Login successful:', response.data);

                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', response.data.email);
                        localStorage.setItem('userName', response.data.name);
                        localStorage.setItem('userId', response.data.userId);

                        alert(`Вхід успішний! Вітаємо, ${response.data.name}!`);
                        this.$router.push('/profile');
                    } catch (error) {
                        console.error('Помилка авторизації:', error.response ? error.response.data : error.message);
                        if (error.response && error.response.status === 401) {
                            alert('Невірний Email або пароль.');
                        } else {
                            alert('Виникла помилка при авторизації. Спробуйте ще раз.');
                        }
                    }
                } else {
                    alert('Будь ласка, виправте помилки у формі.');
                }
            },
        },
    };
</script>