export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/analytics/Analytics.vue'),
    meta: {
      pageTitle: 'Отчёты',
      // breadcrumb: [
      //   // {
      //   //   text: 'Pages',
      //   // },
      //   {
      //     text: 'Главная',
      //     active: true,
      //   },
      // ],
    },
  },
  {
    path: '/report/:name',
    name: 'DetailedReport',
    component: () => import('@/views/dashboard/analytics/DetailedReport.vue'),
    params: true,
    meta: {
      pageTitle: 'Подробный отчёт: ',
      breadcrumb: [
        {
          text: 'Отчёты',
          active: true,
        },
        {
          text: 'Подробный отчёт: ',
          showName: true,
          active: true,
        },
      ],
    },
  },
];
