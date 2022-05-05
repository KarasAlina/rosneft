import Vue from 'vue';
import VueRouter from 'vue-router';
import { getToken } from '@/utils/auth';

// Routes
import auth from '@/router/routes/auth';
import me from '@/router/routes/me';
import error from '@/router/routes/error';
import home from '@/router/routes/home';
import dataExport from '@/router/routes/data-export';
import integration from '@/router/routes/integration';
import campaign from '@/router/routes/campaign';
import users from '@/router/routes/users';
import profile from '@/router/routes/profile';
import managers from '@/router/routes/managers';
import newsletters from '@/router/routes/newsletters';

Vue.use(VueRouter);

const Router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    ...home,
    ...auth,
    ...me,
    ...error,
    ...dataExport,
    ...integration,
    ...campaign,
    ...users,
    ...profile,
    ...managers,
    ...newsletters,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
});

Router.beforeEach((to, _, next) => {
  const isLoggedIn = getToken();

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    next('/');
  }

  return next();
});

export default Router;