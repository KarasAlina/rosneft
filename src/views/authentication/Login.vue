<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0 px-2 pt-0 pb-2">
        <div class="brand-logo">
          <vuexy-logo />
        </div>

        <b-card-title class="mb-1">
          Войти в кабинет
        </b-card-title>
        <b-card-text class="mb-2">
          Введите свои данные для входа в кабинет
        </b-card-text>

        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
        >
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent="send"
          >

            <!-- email -->
            <b-form-group
              label-for="email"
              label="Адрес электронной почты"
            >
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  tabindex="1"
                  id="email"
                  v-model.trim="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="example@email.com"
                />
                <b-popover :show="errors.length > 0 ? true : false" placement="bottom" triggers="" target="email">
                  <div class="text-center">
                    {{ errors[0] }}
                  </div>
                </b-popover>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Пароль</label>
                <b-link :to="'/user/forgot-password'">
                  <small>Забыли пароль?</small>
                </b-link>
              </div>
              <validation-provider
                #default="{ errors }"
                name="Пароль"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    tabindex="2"
                    id="password"
                    v-model.trim="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="••••••"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <b-popover :show="errors.length > 0 ? true : false" placement="bottom" triggers="" target="password">
                  <div class="text-center">
                    {{ errors[0] }}
                  </div>
                </b-popover>
              </validation-provider>
            </b-form-group>
            <b-form-group
              label-for="code"
              v-if="showCodeField"
              label="Код из письма"
            >
              <validation-provider
                #default="{ errors }"
                name="Code"
                :rules="{'required': showCodeField}"
              >
                <b-form-input
                  id="code"
                  tabindex="3"
                  v-model="code"
                  name="code"
                  :state="errors.length > 0 ? false:null"
                  placeholder="6-значный код"
                />
                <b-popover :show="errors.length > 0 ? true : false" placement="bottom" triggers="" target="code">
                  <div class="text-center">
                    {{ errors[0] }}
                  </div>
                </b-popover>
              </validation-provider>
            </b-form-group>
            <!-- checkbox -->
            <b-form-group>
              <b-form-checkbox
                tabindex="4"
                v-if="showCodeField"
                id="remember-me"
                v-model="status"
                name="checkbox-1"
                @change="remember"
              >
                Запомнить меня на этом устройстве
              </b-form-checkbox>
            </b-form-group>

            <!-- alert -->
            <b-alert
                v-if="errorMessage"
                v-height-fade.appear
                variant="danger"
                show
            >
              <div class="alert-body">
                <feather-icon
                    icon="InfoIcon"
                    class="mr-50"
                />
                {{ errorMessage }}
                Проверьте пароль или обратитесь в службу
                  поддержки <a href="mailto:support@rosneftbonus.ru" target="_blank">support@rosneftbonus.ru</a>
              </div>
            </b-alert>

            <!-- submit button -->
            <b-button
                class="d-flex align-items-center justify-content-center"
                variant="primary"
                type="submit"
                block
                :disabled="invalid"
            >
              <template>
                <b-spinner v-if="submitStatus" class="mr-25" small />
                {{ !showCodeField ? 'Получить код' : 'Авторизация'}}{{submitStatus ? '...' : ''}}
              </template>
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  BAlert, BSpinner, BButton, BForm, BFormInput, BFormGroup, BCard, BLink, BCardTitle, BCardText, BInputGroup, BInputGroupAppend, BFormCheckbox, BPopover,
} from 'bootstrap-vue';
import { required, email } from '@validations';
import { togglePasswordVisibility } from '@core/mixins/ui/forms';
import { heightFade } from '@core/directives/animations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  components: {
    VuexyLogo: () => import('@core/layouts/components/Logo.vue'),
    // BSV
    BAlert,
    BSpinner,
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BPopover,
  },

  mixins: [togglePasswordVisibility],

  directives: {
    'height-fade': heightFade,
  },

  data() {
    return {
      userEmail: '',
      password: '',
      code: '',
      status: '',
      submitStatus: null,
      showCodeField: false,
      errorMessage: null,
      // validation rules
      required,
      email,
    };
  },

  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
  },

  methods: {
    async send() {
      if (!this.submitStatus) {
        this.submitStatus = true;

        this.errorMessage = null;
        let data = null;
        if (this.showCodeField) {
          data = {
            email: this.userEmail,
            password: this.password,
            twofa_code: this.code,
          };
        } else {
          data = {
            email: this.userEmail,
            password: this.password,
          };
        }

        try {
          let userData = null;
          if (!this.showCodeField) {
            await this.$store.dispatch('me/SignIn', data);
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: 'Вам на почту был отправлен код для входа',
                icon: 'CoffeeIcon',
                variant: 'success',
              },
            });
            this.showCodeField = true;
          } else {
            userData = await this.$store.dispatch('me/SignIn', data);

            const user = userData.data;

            this.$store.commit('me/SET_USER', user);

            this.$store.commit('me/SET_TOKEN', `Bearer ${user.access_token}`);

            await this.$store.dispatch('program/GetProgramList', { page: 1 });

            await this.$store.dispatch('me/GetAccessProrgams');

            await this.$router.replace('/');

            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: `Добро пожаловать, ${user.first_name}`,
                icon: 'CoffeeIcon',
                variant: 'success',
              },
            });
          }
        } catch (e) {
          this.submitStatus = false;

          this.errorMessage = e.data[0]?.message;
        }

        this.submitStatus = false;
      }
    },

    remember() {
      if (this.status) {
        window.localStorage.setItem('remember', this.status);
      } else {
        window.localStorage.removeItem('remember');
      }
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
