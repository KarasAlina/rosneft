export default [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/all-users/AllUsers.vue'),
    meta: {
      pageTitle: 'Все пользователи',
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
  {
    path: '/users/:id',
    name: 'userProfile',
    component: () => import('@/views/all-users/Profile.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        // {
        //   text: 'Pages',
        // },
        {
          text: 'Карточка участника',
          active: true,
        },
      ],
    },
  },
];
