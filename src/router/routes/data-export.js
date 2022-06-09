export default [
  {
    path: '/data-export',
    name: 'data-export',
    component: () => import('@/views/data-export/DataExport.vue'),
    meta: {
      pageTitle: 'Экспорт данных',
    },
  },
];
