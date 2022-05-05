export default [
  {
    path: '/newsletters',
    name: 'newsletters',
    component: () => import('@/views/newsletters/Newsletters.vue'),
    meta: {
      pageTitle: 'Рассылки',
    },
  },
  {
    path: '/create-newsletter',
    name: 'CreateNewsletter',
    component: () => import('@/views/newsletters/CreateNewsletter.vue'),
    meta: {
      pageTitle: 'Создание рассылки',
      breadcrumb: [
        {
          text: 'Рассылки',
          active: true,
        },
        {
          text: 'Создание рассылки',
          active: true,
        },
      ],
    },
  },
];
