<template>
  <div class="toastification">
    <div class="d-flex align-items-start">
      <b-avatar
        :variant="variant"
        size="1.8rem"
        class="mr-75 flex-shrink-0"
      >
        <feather-icon
          :icon="icon"
          size="15"
        />
      </b-avatar>
      <div class="d-flex flex-grow-1">
        <div>
          <h5
            v-if="title"
            class="mb-0 font-weight-bolder toastification-title"
            :class="`text-${variant}`"
            v-html="title"
          />
          <small
            v-if="text"
            class="d-inline-block text-body"
            v-html="text"
          />
          <ul v-if="list" class="list-group list-group-flush">
            <li
              v-for="(li, i) in list"
              :key="i"
              class="list-group-item pl-0"
              :class="`text-${variant}`"
            >
              {{li.row || li }}
              <ul v-if="li.text" class="list-group list-group-flush mt-50">
                <li
                  v-for="(text, indx) in li.text"
                  :key="indx"
                  >
                    {{text}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <span
          class="cursor-pointer toastification-close-icon ml-auto "
          @click="$emit('close-toast')"
        >
          <feather-icon
            v-if="!hideClose"
            icon="XIcon"
            class="text-body"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { BAvatar } from 'bootstrap-vue';

export default {
  components: {
    BAvatar,
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: { String, Array },
      default: null,
    },
    list: {
      type: Array,
      default: null,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.toastification-close-icon,
.toastification-title {
  line-height: 26px;
}

.toastification-title {
  margin-right: 1rem;
  color: inherit;
}
</style>
