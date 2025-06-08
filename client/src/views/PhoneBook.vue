`<template>
  <div class="d-flex flex-column min-vh-100">
    <main class="flex-grow-1 container my-4 p-4 bg-white rounded shadow-sm">
      <h2 class="h4 text-center mb-4 text-primary">Ваш Телефонний Довідник</h2>

      <div v-if="!isLoggedIn" class="alert alert-warning text-center" role="alert">
        Будь ласка, <router-link to="/login" class="alert-link">увійдіть</router-link>, щоб переглянути та керувати своїми контактами.
      </div>

      <div v-else>
        <form @submit.prevent="saveContact" class="mb-4 p-3 border rounded bg-light">
          <h3 class="h5 mb-3 text-secondary">{{ currentContact.id ? 'Редагувати Контакт' : 'Додати Контакт' }}</h3>
          <input type="hidden" v-model="currentContact.id" />
          <div class="mb-3">
            <label for="contact-name" class="form-label">Ім'я:</label>
            <input
              type="text"
              id="contact-name"
              placeholder="Ім'я контакту"
              :class="['form-control', {'is-invalid': errors.name}]"
              v-model.trim="currentContact.name"
              @blur="validateField('name')"
              required
            />
            <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
          </div>
          <div class="mb-3">
            <label for="contact-phone" class="form-label">Телефон:</label>
            <input
              type="text"
              id="contact-phone"
              placeholder="Номер телефону"
              :class="['form-control', {'is-invalid': errors.phone}]"
              v-model.trim="currentContact.phone"
              @blur="validateField('phone')"
              required
            />
            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
          </div>
          <div class="mb-3">
            <label for="contact-email" class="form-label">Email:</label>
            <input
              type="email"
              id="contact-email"
              placeholder="Email адреса"
              :class="['form-control', {'is-invalid': errors.email}]"
              v-model.trim="currentContact.email"
              @blur="validateField('email')"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          </div>
          <button
            type="submit"
            :class="['btn w-100', currentContact.id ? 'btn-primary' : 'btn-success']"
          >
            {{ currentContact.id ? 'Зберегти зміни' : 'Додати Контакт' }}
          </button>
        </form>

        <div class="mb-4 d-flex">
          <input
            type="text"
            placeholder="Пошук контактів..."
            class="form-control me-2 flex-grow-1"
            v-model.trim="searchQuery"
            @input="performSearch"
          />
          <button @click="performSearch" class="btn btn-info me-2">Пошук</button>
          <button @click="toggleGroupSort" :class="['btn', isGroupedAndSorted ? 'btn-danger' : 'btn-secondary']">
            {{ isGroupedAndSorted ? 'Скасувати групування' : 'Групувати та Сортувати' }}
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover shadow-sm">
            <thead class="bg-primary text-white">
              <tr>
                <th scope="col">Ім'я</th>
                <th scope="col">Телефон</th>
                <th scope="col">Email</th>
                <th scope="col">Дії</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="processedContacts.length === 0">
                <tr>
                  <td colspan="4" class="text-center text-muted py-3">Контактів не знайдено.</td>
                </tr>
              </template>
              <template v-for="item in processedContacts" :key="item.id || item.letter">
                <tr v-if="item.isGroupHeader" class="table-info">
                  <td colspan="4" class="text-start fs-5 fw-bold py-2">{{ item.letter }}</td>
                </tr>
                <tr v-else class="border-b border-gray-200 hover:bg-gray-50">
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.email }}</td>
                  <td>
                    <button @click="editContact(item)" class="btn btn-sm btn-warning me-2">Редагувати</button>
                    <button @click="deleteContact(item.id)" class="btn btn-sm btn-danger">Видалити</button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PhoneBook',
  data() {
    return {
      contacts: [],
      currentContact: { id: null, name: '', phone: '', email: '' },
      searchQuery: '',
      isGroupedAndSorted: false,
      errors: {
        name: '',
        phone: '',
        email: '',
      },
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phoneRegex: /^\+?[\d\s()-]{7,20}$/,
      maxLengths: {
          name: 50,
          phone: 20,
          email: 100,
      },
      isLoggedIn: false,
      userId: null,
    };
  },
  computed: {
    processedContacts() {
      let currentContacts = [...this.contacts];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        currentContacts = currentContacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query)
        );
      }

      if (this.isGroupedAndSorted) {
        currentContacts.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        const grouped = {};
        currentContacts.forEach(contact => {
          const firstLetter = contact.name.charAt(0).toUpperCase();
          if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
          }
          grouped[firstLetter].push(contact);
        });

        const result = [];
        Object.keys(grouped).sort().forEach(letter => {
          result.push({ isGroupHeader: true, letter: letter, id: 'header-' + letter }); // Додаємо id для key
          grouped[letter].forEach(contact => result.push(contact));
        });
        return result;
      }

      return currentContacts;
    },
  },
  async created() {
    this.checkLoginStatus();
    if (this.isLoggedIn && this.userId) {
        await this.fetchContacts();
    } else if (this.isLoggedIn && !this.userId) {
        alert('Дані користувача не знайдено. Будь ласка, увійдіть знову.');
        this.logoutUser();
    }
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.userId = localStorage.getItem('userId');
    },
    getAuthHeaders() {
        return {
            'X-User-Id': this.userId
        };
    },
    async fetchContacts() {
      try {
        const response = await axios.get('http://localhost:3000/api/contacts', { headers: this.getAuthHeaders() });
        this.contacts = response.data;
      } catch (error) {
        console.error('Помилка при завантаженні контактів:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            alert('Будь ласка, увійдіть, щоб переглянути контакти.');
            this.$router.push('/login');
        } else {
            alert('Не вдалося завантажити контакти. Перевірте, чи запущено бекенд.');
        }
      }
    },

    async addContact() {
      try {
        const response = await axios.post('http://localhost:3000/api/contacts', {
          name: this.currentContact.name,
          phone: this.currentContact.phone,
          email: this.currentContact.email,
          user_id: this.userId
        }, { headers: this.getAuthHeaders() });
        this.contacts.push(response.data);
        this.clearForm();
        this.isGroupedAndSorted = false;
        this.searchQuery = '';
      } catch (error) {
        console.error('Помилка при додаванні контакту:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            alert('Будь ласка, увійдіть, щоб додати контакт.');
            this.$router.push('/login');
        } else {
            alert('Не вдалося додати контакт.');
        }
      }
    },

    async updateContact() {
      try {
        const response = await axios.put(`http://localhost:3000/api/contacts/${this.currentContact.id}`, {
          name: this.currentContact.name,
          phone: this.currentContact.phone,
          email: this.currentContact.email,
          user_id: this.userId
        }, { headers: this.getAuthHeaders() });
        const index = this.contacts.findIndex((c) => c.id === response.data.id);
        if (index !== -1) {
          this.contacts.splice(index, 1, response.data);
        }
        this.clearForm();
        this.isGroupedAndSorted = false;
        this.searchQuery = '';
      } catch (error) {
        console.error('Помилка при оновленні контакту:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            alert('Будь ласка, увійдіть, щоб оновити контакт.');
            this.$router.push('/login');
        } else {
            alert('Не вдалося оновити контакт.');
        }
      }
    },

    async deleteContact(id) {
      if (confirm('Ви впевнені, що хочете видалити цей контакт?')) {
        try {
          await axios.delete(`http://localhost:3000/api/contacts/${id}`, { headers: this.getAuthHeaders() });
          this.contacts = this.contacts.filter((contact) => contact.id !== id);
          this.isGroupedAndSorted = false; // Скидаємо групування при видаленні
          this.searchQuery = ''; // Скидаємо пошук при видаленні
        } catch (error) {
          console.error('Помилка при видаленні контакту:', error.response ? error.response.data : error.message);
          if (error.response && error.response.status === 401) {
            alert('Будь ласка, увійдіть, щоб видалити контакт.');
            this.$router.push('/login');
          } else {
            alert('Не вдалося видалити контакт.');
          }
        }
      }
    },

    validateField(field) {
      let isValid = true;
      this.errors[field] = '';
      const inputElement = document.getElementById(`contact-${field}`);
      if (inputElement) {
        inputElement.classList.remove('is-invalid');
      }

      const value = this.currentContact[field];
      const maxLength = this.maxLengths[field];

      if (value === '' || value === null || value === undefined) {
        this.errors[field] = 'Це поле не може бути порожнім.';
        isValid = false;
      } else if (value.length > maxLength) {
          this.errors[field] = `Максимальна довжина ${maxLength} символів.`;
          isValid = false;
      }
      else {
        if (field === 'email' && !this.emailRegex.test(value)) {
          this.errors[field] = 'Будь ласка, введіть коректний Email.';
          isValid = false;
        } else if (field === 'phone' && !this.phoneRegex.test(value)) {
          this.errors[field] = 'Будь ласка, введіть коректний номер телефону (мін. 7, макс. 20 символів; включаючи +, пробіли, дужки, дефіси).';
          isValid = false;
        }
      }

      if (!isValid) {
        if (inputElement) {
          inputElement.classList.add('is-invalid');
        }
      }

      return isValid;
    },

    validateForm() {
      let isFormValid = true;
      for (const field of ['name', 'phone', 'email']) {
        if (!this.validateField(field)) {
          isFormValid = false;
        }
      }
      return isFormValid;
    },

    async saveContact() {
      if (!this.validateForm()) {
        alert('Будь ласка, виправте помилки у формі.');
        return;
      }
      if (!this.isLoggedIn || !this.userId) {
          alert('Будь ласка, увійдіть, щоб керувати контактами.');
          this.$router.push('/login');
          return;
      }

      if (this.currentContact.id) {
        await this.updateContact();
      } else {
        await this.addContact();
      }
    },

    editContact(contact) {
      this.currentContact = { ...contact };
      this.hideAllErrors();
    },

    clearForm() {
      this.currentContact = { id: null, name: '', phone: '', email: '' };
      this.hideAllErrors();
    },

    hideAllErrors() {
      this.errors = { name: '', phone: '', email: '' };
      ['name', 'phone', 'email'].forEach(field => {
        const inputElement = document.getElementById(`contact-${field}`);
        if (inputElement) {
          inputElement.classList.remove('is-invalid');
        }
      });
    },

    performSearch() {
    },

    toggleGroupSort() {
      if (!this.isGroupedAndSorted && this.searchQuery) {
          this.searchQuery = '';
      }
      this.isGroupedAndSorted = !this.isGroupedAndSorted;
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
  mounted() {
  },
};
</script>`