export default [
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/reports/Reports.vue'),
    meta: {
      pageTitle: 'Отчеты',
    },
  },
];
