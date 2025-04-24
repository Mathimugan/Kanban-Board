import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue"
import Register from "../components/Register.vue"
import Home from "../components/Home.vue"
import { getAuth } from "firebase/auth";

const auth = getAuth();
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/", component: Register,
    },
    {
      path: "/login", component: Login,
    },
    {
      path: "/register", component: Register,
    },
    {
      path: "/home", component: Home,
      meta: {
        requiresAuth: true // This route requires authentication
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
