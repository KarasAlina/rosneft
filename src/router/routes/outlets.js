export default [
  {
    path: '/outlets',
    name: 'outlets',
    component: () => import('@/views/outlets/AllOutlets.vue'),
    meta: {
      pageTitle: 'Торговые точки',
      // breadcrumb: [
      //   // {
      //   //   text: 'Pages',
      //   // },
      //   {
      //     text: 'Все пользователи',
      //     active: true,
      //   },
      // ],
    },
  },
];
