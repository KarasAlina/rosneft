export default [
  {
    path: '/integration',
    name: 'integration',
    component: () => import('@/views/integration/Integration.vue'),
    meta: {
      pageTitle: 'Интеграции',
    },
  },
];
