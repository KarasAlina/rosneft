export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/analytics/Analytics.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        // {
        //   text: 'Pages',
        // },
        {
          text: 'Главная',
          active: true,
        },
      ],
    },
  },
];
