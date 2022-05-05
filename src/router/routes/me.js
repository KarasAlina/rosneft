export default [
  {
    path: '/me/profile',
    name: 'me-profile',
    component: () => import('@/views/me/Profile.vue'),
    meta: {
      pageTitle: 'Мой профиль',
    },
  },
];
