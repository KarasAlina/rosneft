export default [
  {
    path: '/managers',
    name: 'managers',
    component: () => import('@/views/managers/Managers.vue'),
    meta: {
      pageTitle: 'Управление менеджерами',
    },
  },
];
