<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Forgot password-->
      <b-card class="mb-0 pb-3 px-1">
          <div class="brand-logo">
            <vuexy-logo />
          </div>
          <b-card-title
            title-tag="h2"
            class="font-weight-bold mb-1"
          >
            Забыли пароль? 🔒
          </b-card-title>
          <b-card-text class="mb-2">
            Введите адрес электронной почты, и мы вышлем вам инструкции по сбросу пароля
          </b-card-text>

          <!-- form -->
          <validation-observer ref="simpleRules" #default="{invalid}">
            <b-form
              class="auth-forgot-password-form mt-2"
              @submit.prevent="send"
            >
              <b-form-group
                label="Email"
                label-for="forgot-password-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="forgot-password-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="forgot-password-email"
                    placeholder="john@example.com"
                  />
                  <b-popover :show="errors.length > 0 ? true : false" placement="bottom" triggers="" target="forgot-password-email">
                    <div class="text-center">
                      {{ errors[0] }}
                    </div>
                  </b-popover>
                </validation-provider>
              </b-form-group>

              <!-- submit button -->
              <b-button
                class="d-flex align-items-center justify-content-center"
                variant="primary"
                type="submit"
                block
                :disabled="invalid || submitStatus"
              >
                <template>
                  <b-spinner v-if="submitStatus" class="mr-25" small />
                  Отправить{{submitStatus ? '...' : ''}}
                </template>
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <b-link :to="{name:'login'}">
              <feather-icon icon="ChevronLeftIcon" /> Вернуться к авторизации
            </b-link>
          </p>
      </b-card>
    </div>
      <!-- /Forgot password-->
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  BCard, BLink, BSpinner, BCardTitle, BCardText, BForm, BFormGroup, BFormInput, BButton, BPopover,
} from 'bootstrap-vue';
import VuexyLogo from '@core/layouts/components/Logo.vue';
import { required, email } from '@validations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  components: {
    VuexyLogo,
    BCard,
    BLink,
    BSpinner,
    BForm,
    BButton,
    BFormGroup,
    BFormInput,
    BCardTitle,
    BCardText,
    BPopover,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      status: '',
      submitStatus: null,
      errorMessage: null,
      userEmail: '',
      // validation
      required,
      email,
    };
  },
  computed: {

  },
  methods: {
    async send() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        this.errorMessage = null;

        const data = {
          email: this.userEmail,
        };

        try {
          await this.$store.dispatch('me/ForgotPassword', data);

          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Успешно! На Вашу почту было отправлено письмо.',
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          });
        } catch (e) {
          this.submitStatus = false;

          this.errorMessage = e.data[0]?.message;
        }

        this.submitStatus = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
