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
    path: '/campaign/checks',
    name: 'campaignChecks',
    component: () => import('@/views/campaign/checks/Checks.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Чеки',
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
    path: '/campaign/prizes',
    name: 'campaignPrizes',
    component: () => import('@/views/campaign/prizes/Prizes.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Призы',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/raffle',
    name: 'campaignRaffle',
    component: () => import('@/views/campaign/raffle/Raffle.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Розыгрыши',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/feedback',
    name: 'campaignFeedback',
    component: () => import('@/views/campaign/feedback/Feedback.vue'),
    meta: {
      pageTitle: null,
      breadcrumb: [
        {
          text: 'Обратная связь',
          active: true,
        },
      ],
    },
  },
  {
    path: '/campaign/reports',
    name: 'campaignReport',
    component: () => import('@/views/campaign/reports/Reports.vue'),
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
