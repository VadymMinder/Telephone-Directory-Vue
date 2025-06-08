<template>
    <div class="d-flex flex-column flex-grow-1">
        <main class="flex-grow-1 container my-4 p-4 bg-white rounded shadow-sm" style="max-width: 500px;">
            <h2 class="h4 text-center mb-4 text-primary">Реєстрація Користувача</h2>

            <div v-if="isLoggedIn" class="alert alert-info text-center" role="alert">
                Ви вже увійшли до акаунту!
                <router-link to="/profile" class="alert-link">Перейти до профілю</router-link>.
            </div>

            <form v-else @submit.prevent="registerUser">
                <div class="mb-3">
                    <label for="name" class="form-label">Ім'я:</label>
                    <input type="text" id="name" class="form-control" :class="{'is-invalid': errors.name}" v-model.trim="user.name" @blur="validateField('name')" required>
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>
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
                <div class="mb-3">
                    <label for="gender" class="form-label">Стать:</label>
                    <select id="gender" class="form-select" :class="{'is-invalid': errors.gender}" v-model="user.gender" @blur="validateField('gender')" required>
                        <option value="">Оберіть стать</option>
                        <option value="Чоловіча">Чоловіча</option>
                        <option value="Жіноча">Жіноча</option>
                        <option value="Інша">Інша</option>
                    </select>
                    <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
                </div>
                <div class="mb-3">
                    <label for="dob" class="form-label">Дата народження:</label>
                    <input type="date" id="dob" class="form-control" :class="{'is-invalid': errors.dob}" v-model="user.dob" @blur="validateField('dob')" required>
                    <div v-if="errors.dob" class="invalid-feedback">{{ errors.dob }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Зареєструватись</button>
            </form>
        </main>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'RegisterPage',
        data() {
            return {
                user: {
                    name: '',
                    email: '',
                    password: '',
                    gender: '',
                    dob: '',
                },
                errors: {
                    name: '',
                    email: '',
                    password: '',
                    gender: '',
                    dob: '',
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
                } else {
                    if (field === 'email' && !this.emailRegex.test(value)) {
                        this.errors[field] = 'Будь ласка, введіть коректний Email.';
                        isValid = false;
                    }
                }
                return isValid;
            },
            validateForm() {
                let isFormValid = true;
                for (const field of ['name', 'email', 'password', 'gender', 'dob']) {
                    if (!this.validateField(field)) {
                        isFormValid = false;
                    }
                }
                return isFormValid;
            },
            async registerUser() {
                if (this.validateForm()) {
                    try {
                        const response = await axios.post('http://localhost:3000/api/register', this.user);
                        console.log('Server response:', response.data);

                        alert('Реєстрація успішна!');
                        this.$router.push('/login');
                    } catch (error) {
                        console.error('Помилка при реєстрації:', error.response ? error.response.data : error.message);
                        if (error.response && error.response.status === 409) {
                            alert('Цей Email вже зареєстровано. Будь ласка, використайте інший.');
                        } else {
                            alert('Виникла помилка при реєстрації. Спробуйте ще раз.');
                        }
                    }
                } else {
                    alert('Будь ласка, виправте помилки у формі.');
                }
            },
        },
    };
</script>