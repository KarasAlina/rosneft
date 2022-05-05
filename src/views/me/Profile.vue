<template>
  <div>
    <b-card>
      <b-row no-gutters>
        <b-col md="4" class="d-flex">
          <b-avatar
            size="104"
            variant="light-primary"
            class="mr-2"
            :src="user.photo"
            rounded
          />
          <div>
            <p class="font-weight-bolder mb-0 font-medium-3 line-height-condensed">
              {{ user.first_name | capitalize}} {{ user.last_name | capitalize}}
            </p>
            <span class="user-email">{{ user.email }}</span>
            <b-button
              class="mt-1"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              @click="isActiveSideBarAddProfile = true"
            >
              <span class="text-nowrap">Редактировать</span>
            </b-button>
          </div>
        </b-col>
        <b-col md="4" class="border-right">
          <!-- BODY -->
          <b-list-group>
            <b-list-group-item
              v-for="(item,i) in userInfo"
              :key="i"
              class="py-50 px-0 d-flex flex-row flex-nowrap justify-center align-items-baseline border-0"
            >
              <b class="pr-50 pl-50 w-50">{{ item.key }}</b>
              <div class="pl-50 w-50">{{ item.value || '-' }}</div>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-card>
    <b-row>
      <b-col>
        <b-card
          title="Активность пользователя"
        >
          <b-card-text>В разработке...</b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-card
          title="Участие в программах"
        >
          <b-card-text>В разработке...</b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCard, BAvatar, BRow, BCol, BListGroup, BListGroupItem, BButton, BCardText,
} from 'bootstrap-vue';

export default {
  components: {
    BCard,
    BAvatar,
    BRow,
    BCol,
    BButton,
    BCardText,
    BListGroup,
    BListGroupItem,
  },
  computed: {
    user() {
      return this.$store.getters['me/data'];
    },
    roles() {
      return this.$store.getters['me/roles'];
    },
    userInfo() {
      const data = [
        {
          key: 'Имя',
          value: this.user.first_name,
        },
        {
          key: 'Фамилия:',
          value: this.user.last_name,
        },
        {
          key: 'Роль:',
          value: this.user.role,
        },
        {
          key: 'E-mail:',
          value: this.user.email,
        },
        {
          key: 'Населенный пункт:',
          value: this.user.city,
        },
        {
          key: 'Номер телефона:',
          value: this.user.phone,
        },
      ];
      return data;
    },
  },
};
</script>

<style>

</style>
