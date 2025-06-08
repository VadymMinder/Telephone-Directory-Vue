<template>
    <div class="d-flex flex-column flex-grow-1">
        <main class="flex-grow-1 container my-4 p-4 bg-white rounded shadow-sm">
            <h2 class="h4 text-center mb-4 text-primary">Ласкаво просимо до Телефонного Довідника!</h2>
            <p class="lead text-center">
                Ваш особистий помічник для швидкого та зручного пошуку контактів.
                Цей додаток допоможе вам організувати ваші телефонні номери, адреси електронної пошти та іншу важливу інформацію.
            </p>
            <div class="mt-4 text-center">
                <p class="text-muted mb-3">Щоб почати, будь ласка, увійдіть або зареєструйтесь:</p>
                <router-link to="/login" class="btn btn-primary me-2">Вхід</router-link>
                <router-link to="/register" class="btn btn-success">Реєстрація</router-link>
            </div>
        </main>
    </div>
</template>

<script>
    export default {
        name: 'HomePage',
    };
</script>