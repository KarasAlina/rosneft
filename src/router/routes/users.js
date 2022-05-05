export default [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/all-users/AllUsers.vue'),
    meta: {
      pageTitle: '',
      breadcrumb: [
        // {
        //   text: 'Pages',
        // },
        {
          text: 'Все пользователи',
          active: true,
        },
      ],
    },
  },
];
