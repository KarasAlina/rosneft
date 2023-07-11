<template>
  <div>
    <b-card no-body class="p-0" v-if="mailing">
      <b-form>
        <!-- Step 1 -->
        <div class="py-4 px-5 border-bottom">
          <div class="px-3">
            <b-card-text class="font-medium-3">1. Добавьте адреса, разделенные запятой</b-card-text>
            <!-- {{mailing}} -->
            <b-row>
              <b-col
                sm="12"
                md="6"
              >
                <b-form-group
                  id="form-title-group"
                >
                  <label for="form-title">E-mail адреса<span class="text-danger">*</span></label>
                  <b-form-input
                    id="form-title"
                    v-model="form.email"
                    type="text"
                    placeholder="Введите E-mail"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-button
                  variant="outline-primary"
                  class="mr-auto"
                  @click="send('test')"
                >
                  <feather-icon
                    class="mr-50"
                    icon="SendIcon"
                    size="14"
                  />
                  Отправить тестовое письмо
                </b-button>
              </b-col>
            </b-row>
          </div>
        </div>
        <!-- Step 1 end -->
        <!-- Step 2 -->
        <div class="py-4 px-5 border-bottom">
          <div class="px-3">
            <b-card-text class="font-medium-3 mb-2">2. Параметры рассылки</b-card-text>
            <div class="d-flex align-items-center mb-2">
              <span>Всего получателей:</span>
              <span class="px-50 pt-25 pb-15 ml-50 mr-2 rounded-pill line-height-1 font-small-2 bg-success">{{ mailing.recipient_id || mailing.recipient_id.length }}</span>
            </div>
            <b-row class="mb-2">
              <b-col
                cols="12"
                md="3"
              >
                <div
                  class="template-preview rounded border cursor-pointer"
                  @click="showPreview()"
                >
                  <img
                    v-if="mailing && mailing.image"
                    :src="require(mailing.image)"
                    :alt="mailing.name"
                    class="template-preview-image"
                  >
                  <div
                    v-else
                    class="template-preview-image-placeholder d-flex align-items-center justify-content-center"
                  >
                    <feather-icon
                      class="text-light"
                      icon="ImageIcon"
                      size="38"
                    />
                  </div>
                  <div class="p-1 w-100">
                    {{ mailing.name }}
                  </div>
                </div>
              </b-col>
            </b-row>
            <div class="mailing-actions d-flex align-items-center bg-lighten rounded p-2 w-100">
              <b-button
                variant="outline-success"
                class="mr-1"
                @click="send('test', true)"
              >
                Предпросмотр
              </b-button>
              <b-button
                variant="success"
                class="mr-auto"
                 @click="send('draft')"
              >
                <feather-icon
                  class="mr-50"
                  icon="SendIcon"
                  size="14"
                />
                Отправить
              </b-button>
              <b-button
                variant="outline-light"
                class="mr-1"
                @click="send('draft')"
              >
                Сохранить как черновик
              </b-button>
              <b-button
                variant="outline-light"
                class="mr-2"
                :to="{ name: 'Mailing' }"
              >
                Отменить
              </b-button>
              <div
                class="text-light d-flex align-items-center cursor-pointer"
                @click="deleteMailing()"
              >
                <feather-icon
                  class="text-light mr-50 mb-25"
                  icon="Trash2Icon"
                  size="14"
                />
                Удалить рассылку
              </div>
            </div>
          </div>
        </div>
        <!-- Step 2 end -->
      </b-form>
    </b-card>
    <TemplatePreviewModal v-if="mailing" :title="mailing.name" />
  </div>
</template>

<script>
import {
  BCard,
  BCardText,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import TemplatePreviewModal from '../../components/TemplatePreviewModal.vue';

export default {
  data: () => ({
    mailing: null,
    form: {
      email: null,
      template: null,
      greeting: null,
      text: null,
    },
    pending: null,
    pendingOptions: null,
    submitStatus: null,
  }),
  watch: {
  },
  computed: {
    me() {
      return this.$store.getters['me/data'];
    },
    templates() {
      return this.$store.getters['mailing/templates']?.items;
    },
  },
  methods: {
    async send(status, sendToMe) {
      if (!this.submitStatus) {
        this.submitStatus = true;

        const email = sendToMe ? this.me.email : this.form.email;

        const data = {
          email,
          name: this.mailing.name,
          recipient_id: this.mailing.recipient_id,
          welcome_text: this.mailing.welcome_text,
          message_text: this.mailing.message_text,
          status,
        };
        const title = status === 'test' ? 'Тестовая рассылка была отправлена на указаные адреса почты' : 'Расслыка успешно создана';
        try {
          await this.$store.dispatch('mailing/SetItem', data);
          this.$router.push({ name: 'Mailing' });
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title,
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          });
        } catch (e) {
          this.submitStatus = false;

          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: e,
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          });
        }

        this.submitStatus = false;
      }
    },
    async deleteMailing() {
      const { id } = this.$route.params;
      await this.$store.dispatch('mailing/DeleteMailing', id).then(() => {
        this.$route.push({ name: 'Mailing' });
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: 'Рассылка удалена',
            icon: 'Trash2Icon',
            variant: 'success',
          },
        });
      });
    },
    showPreview() {
      this.$bvModal.show('preview');
    },
    async getItem() {
      const { id } = this.$route.params;
      const res = await this.$store.dispatch('mailing/GetItem', id);

      this.mailing = res;
    },
    async getTemplateList() {
      await this.$store.dispatch('mailing/GetTemplateList');
    },
  },
  mounted() {
    this.getItem();
    this.getTemplateList();
  },
  components: {
    BCard,
    BCardText,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    TemplatePreviewModal,
  },
};

</script>

<style lang="scss" scoped>
</style>
