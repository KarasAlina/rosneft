export default [
  {
    path: '/user/login',
    name: 'login',
    component: () => import('@/views/authentication/Login.vue'),
    meta: {
      layout: 'full',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/user/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
];
