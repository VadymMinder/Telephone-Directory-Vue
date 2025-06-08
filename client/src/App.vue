<template>
    <div id="app" class="d-flex flex-column min-vh-100">
        <header class="bg-primary text-white p-3 shadow-sm">
            <div class="container d-flex justify-content-between align-items-center">
                <h1 class="h3 mb-0">Телефонний Довідник</h1>
            </div>
        </header>

        <nav class="bg-dark text-white p-2 shadow-sm">
            <div class="container">
                <ul class="nav justify-content-center">
                    <li class="nav-item"><router-link class="nav-link text-white" to="/">Головна</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-white" to="/register">Реєстрація</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-white" to="/login">Вхід</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-white" to="/profile">Профіль</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-white" to="/about">Про Додаток</router-link></li>
                    <li class="nav-item"><router-link class="nav-link text-white" to="/app">Довідник</router-link></li>
                </ul>
            </div>
        </nav>

        <main class="flex-grow-1">
            <router-view />
        </main>

        <footer class="bg-dark text-white p-3">
            <div class="container text-center text-sm">
                &copy; 2025 Телефонний Довідник. Всі права захищені. Лабораторна робота.
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        name: 'App',
    };
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>