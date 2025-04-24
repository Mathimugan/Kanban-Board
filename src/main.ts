import "./assets/main.css"
import { createApp } from 'vue';
import App from './App.vue';
import router from "./router/index";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

let app: ReturnType<typeof createApp> | null = null;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
});

