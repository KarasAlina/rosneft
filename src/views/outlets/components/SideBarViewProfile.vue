<template>
  <b-sidebar
      width="35vw"
      id="sidebar-right"
      :visible="isActiveSideBarViewProfile"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-active-side-bar-view-profile', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-star content-sidebar-header px-2 py-2">
        <div>
          <h5 class="mb-0 pb-25">
            Краткий простмотр
          </h5>
          <p class="d-block text-light">
            #{{fields[0].value}} {{fields[2].value}}
          </p>
        </div>
        <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="20"
            @click="hide"
        />
      </div>
      <!-- BODY -->
      <b-list-group class="my-2">
        <b-list-group-item
            :key="index"
            v-for="(field, index) in fields"
            class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline border-0">
          <b class="pr-50 w-50">{{field.label}}</b>

          <div class="text-right pl-50 w-50">{{field.value ? field.value : '-'}}</div>
        </b-list-group-item>
      </b-list-group>

      <div class="text-left m-2">
        <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="primary"
            @click="hide"
        >
          Закрыть
        </b-button>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BListGroup, BListGroupItem, BButton,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  name: 'SideBarViewProfile',

  model: {
    prop: 'isActiveSideBarViewProfile',
    event: 'update:is-active-side-bar-view-profile',
  },

  props: {
    isActiveSideBarViewProfile: {
      type: Boolean,
      required: true,
    },

    current: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    fields() {
      const a = this.$store.getters['outlet/optionsAll']?.map((item) => {
        const b = this.current[item.key];

        const c = { ...item };

        c.value = b;

        return c;
      });

      const d = a?.filter((item) => item.key !== 'actions');

      return d;
    },

    id() {
      const [{ value }] = this.fields.filter((item) => item.key === 'id');

      return value;
    },
  },

  methods: {},

  mounted() {},

  components: {
    // BS
    BButton,
    BSidebar,
    BListGroup,
    BListGroupItem,
  },

  directives: {
    Ripple,
  },
};
</script>

<style lang="sass" scoped></style>
