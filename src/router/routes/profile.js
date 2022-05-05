export default [
  {
    path: '/:moduleId/profile/:id',
    name: 'profile',
    component: () => import('@/views/profile/Profile.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        // {
        //   text: 'Pages',
        // },
        {
          text: 'Карточка участника проекта',
          active: true,
        },
      ],
    },
  },
  {
    path: '/:superModuleId/super-profile/:id',
    name: 'superProfile',
    component: () => import('@/views/profile/SuperProfile.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        // {
        //   text: 'Pages',
        // },
        {
          text: 'Общая карточка участника',
          active: true,
        },
      ],
    },
  },
];
