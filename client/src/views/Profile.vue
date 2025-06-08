<template>
    <div class="d-flex flex-column min-vh-100">
        <main class="flex-grow-1 container my-4 p-4 bg-white rounded shadow-sm">
            <h2 class="h4 text-center mb-4 text-primary">Профіль Користувача</h2>

            <div class="text-end mb-3">
                <button class="btn btn-danger" @click="logoutUser">Вийти</button>
            </div>

            <div v-if="!isLoggedIn" class="alert alert-warning text-center" role="alert">
                Будь ласка, <router-link to="/login" class="alert-link">увійдіть</router-link>, щоб переглянути свій профіль.
            </div>

            <div v-else>
                <div v-if="!isEditing" class="table-responsive">
                    <table class="table table-bordered shadow-sm">
                        <tbody>
                            <tr>
                                <th scope="row" class="bg-light">Ім'я:</th>
                                <td>{{ profile.name }}</td>
                            </tr>
                            <tr>
                                <th scope="row" class="bg-light">Email:</th>
                                <td>{{ profile.email }}</td>
                            </tr>
                            <tr>
                                <th scope="row" class="bg-light">Стать:</th>
                                <td>{{ profile.gender }}</td>
                            </tr>
                            <tr>
                                <th scope="row" class="bg-light">Дата народження:</th>
                                <td>{{ profile.dob }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="p-3 border rounded bg-light" style="max-width: 500px; margin: 0 auto;">
                    <h3 class="h5 mb-3 text-secondary">Редагувати Профіль</h3>
                    <form @submit.prevent="saveProfile">
                        <div class="mb-3">
                            <label for="edit-profile-name" class="form-label">Ім'я:</label>
                            <input type="text" id="edit-profile-name" class="form-control" :class="{'is-invalid': errors.name}" v-model.trim="profile.name" @blur="validateField('name')" required>
                            <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-profile-email" class="form-label">Email:</label>
                            <input type="email" id="edit-profile-email" class="form-control" :class="{'is-invalid': errors.email}" v-model.trim="profile.email" @blur="validateField('email')" required>
                            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-profile-gender" class="form-label">Стать:</label>
                            <select id="edit-profile-gender" class="form-select" :class="{'is-invalid': errors.gender}" v-model="profile.gender" @blur="validateField('gender')" required>
                                <option value="">Оберіть стать</option>
                                <option value="Чоловіча">Чоловіча</option>
                                <option value="Жіноча">Жіноча</option>
                                <option value="Інша">Інша</option>
                            </select>
                            <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-profile-dob" class="form-label">Дата народження:</label>
                            <input type="date" id="edit-profile-dob" class="form-control" :class="{'is-invalid': errors.dob}" v-model="profile.dob" @blur="validateField('dob')" required>
                            <div v-if="errors.dob" class="invalid-feedback">{{ errors.dob }}</div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-success me-2">Зберегти</button>
                            <button type="button" class="btn btn-secondary" @click="cancelEdit">Відмінити</button>
                        </div>
                    </form>
                </div>

                <div class="text-center mt-4">
                    <button v-if="!isEditing" class="btn btn-primary" @click="startEdit">Редагувати профіль</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'ProfilePage',
        data() {
            return {
                profile: {
                    id: null,
                    name: '',
                    email: '',
                    gender: '',
                    dob: '',
                },
                originalProfile: {},
                isEditing: false,
                isLoggedIn: false,
                errors: {
                    name: '',
                    email: '',
                    gender: '',
                    dob: '',
                },
                emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            };
        },
        async created() {
            this.checkLoginStatus();
            if (this.isLoggedIn) {
                await this.fetchProfile();
            }
        },
        methods: {
            checkLoginStatus() {
                this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                this.profile.id = localStorage.getItem('userId');
            },
            async fetchProfile() {
                if (!this.profile.id) {
                    console.error('User ID not found in localStorage.');
                    return;
                }
                try {
                    const response = await axios.get(`http://localhost:3000/api/profile/${this.profile.id}`);
                    this.profile = response.data;
                } catch (error) {
                    console.error('Помилка завантаження профілю:', error.response ? error.response.data : error.message);
                    alert('Не вдалося завантажити профіль. Спробуйте увійти знову.');
                    this.logoutUser();
                }
            },
            startEdit() {
                this.originalProfile = { ...this.profile };
                this.isEditing = true;
                this.hideAllErrors();
            },
            cancelEdit() {
                this.profile = { ...this.originalProfile };
                this.isEditing = false;
                this.hideAllErrors();
            },
            validateField(field) {
                let isValid = true;
                this.errors[field] = '';

                const value = this.profile[field];

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
                for (const field of ['name', 'email', 'gender', 'dob']) {
                    if (!this.validateField(field)) {
                        isFormValid = false;
                    }
                }
                return isFormValid;
            },
            async saveProfile() {
                if (this.validateForm()) {
                    try {
                        const response = await axios.put(`http://localhost:3000/api/profile/${this.profile.id}`, {
                            name: this.profile.name,
                            email: this.profile.email,
                            gender: this.profile.gender,
                            dob: this.profile.dob,
                        });
                        console.log('Profile updated:', response.data);
                        alert('Профіль успішно оновлено!');
                        this.isEditing = false;
                    } catch (error) {
                        console.error('Помилка оновлення профілю:', error.response ? error.response.data : error.message);
                        if (error.response && error.response.status === 409) {
                            alert('Цей Email вже використовується іншим користувачем.');
                        } else {
                            alert('Не вдалося оновити профіль. Спробуйте ще раз.');
                        }
                    }
                } else {
                    alert('Будь ласка, виправте помилки у формі.');
                }
            },
            hideAllErrors() {
                this.errors = { name: '', email: '', gender: '', dob: '' };
            },
            logoutUser() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userId');
                alert('Ви вийшли з системи.');
                this.$router.push('/login');
            },
        },
    };
</script>