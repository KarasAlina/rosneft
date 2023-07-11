import Mailing from '@/views/mailing/Mailing.vue';
import CreateMailing from '@/views/mailing/CreateMailing.vue';

export default [
  {
    path: '/mailing',
    name: 'Mailing',
    component: Mailing,
    meta: {
      pageTitle: 'Рассылки',
    },
  },
  {
    path: '/create-mailing',
    name: 'CreateMailing',
    component: CreateMailing,
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
  {
    path: '/mailing/:id',
    name: 'PreviewMailing',
    component: () => import('@/views/mailing/PreviewMailing.vue'),
    meta: {
      pageTitle: 'Предпросмотр и отправка',
      breadcrumb: [
        {
          text: 'Рассылки',
          active: true,
        },
        {
          text: 'Создание рассылки',
          active: true,
        },
        {
          text: 'Предпросмотр и отправка',
          active: true,
        },
      ],
    },
  },
];
