export default [
  {
    path: '/campaign/users',
    name: 'campaignUsers',
    component: () => import('@/views/campaign/users/Users.vue'),
    meta: {
      pageTitle: 'Участники',
      campaign: true,
      breadcrumb: [
        {
          text: 'Участники',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/outlets',
    name: 'campaignOutlets',
    component: () => import('@/views/campaign/outlets/Outlets.vue'),
    meta: {
      pageTitle: 'Торговые точки',
      campaign: true,
      breadcrumb: [
        {
          text: 'Торговые точки',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/bonus-points',
    name: 'campaignBonusPoints',
    component: () => import('@/views/campaign/bonusPoints/BonusPoints.vue'),
    meta: {
      pageTitle: 'Бонусные баллы',
      campaign: true,
      breadcrumb: [
        {
          text: 'Бонусные баллы',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/activity',
    name: 'campaignActivity',
    component: () => import('@/views/campaign/activity/Activity.vue'),
    meta: {
      pageTitle: null,
      campaign: true,
      breadcrumb: [
        {
          text: 'Активности',
          active: true,
        },
      ],
    },
  },

  {
    path: '/campaign/plan',
    name: 'campaignPlan',
    component: () => import('@/views/campaign/plan/Plan.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Планы',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/sale',
    name: 'campaignSale',
    component: () => import('@/views/campaign/sale/Sale.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Продажи',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/supervisors-report',
    name: 'campaignReport',
    component: () => import('@/views/campaign/supervisors-report/SupervisorsReport.vue'),
    meta: {
      pageTitle: null,
      campaign: true,
      breadcrumb: [
        {
          text: 'Отчеты супервайзера',
          active: true,
        },
      ],
    },
  },
];
