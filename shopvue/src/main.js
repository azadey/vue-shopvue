
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from '@/utility/FirebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useThemeStore } from '@/stores/themeStore'

import App from './App.vue'
import router from './router/routes'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);

const themeStore = useThemeStore();
if (themeStore.theme) {
    document.body.setAttribute('data-bs-theme', themeStore.theme);
}


let isMounted = false;

onAuthStateChanged(auth, async (user) => {
    if (!isMounted) {
        app.mount('#app');
        isMounted = true;
    }
});
