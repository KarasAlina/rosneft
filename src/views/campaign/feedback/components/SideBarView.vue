<template>
  <b-sidebar
      width="40vw"
      id="sidebar-right"
      :visible="isActiveSideBarView"
      bg-variant="white"
      sidebar-class="sidebar-lg"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-active-side-bar-view', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Краткий простмотр
        </h5>

        <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
        />
      </div>

      <!-- BODY -->
      <b-list-group class="m-2">
        <b-list-group-item
            :key="index"
            v-for="(field, index) in fields"
            class="pl-2 pr-2 d-flex flex-row flex-nowrap justify-center align-items-baseline">
          <b class="text-right pr-50 w-50">{{field.label}}</b>

          <div class="pl-50 w-50">
            <a
                v-if="field.key === 'photos'"
                href="#"
                @click.prevent="$emit('openImages', field.value)">
              открыть
            </a>

            <template v-else>{{field.value ? field.value : '-'}}</template>
          </div>
        </b-list-group-item>
      </b-list-group>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BListGroup, BListGroupItem,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  name: 'SideBarViewCheck',

  model: {
    prop: 'isActiveSideBarView',
    event: 'update:is-active-side-bar-view-check',
  },

  props: {
    isActiveSideBarView: {
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
      const a = this.$store.getters['feedback/options']?.map((item) => {
        const b = this.current[item.key];

        const c = { ...item };

        c.value = b;

        if (c.key === 'theme') {
          c.value = c.data.value && this.resolveValue(c.data.value, b);
        }

        if (c.key === 'status') {
          c.value = c.data.value && this.resolveValue(c.data.value, b);
        }

        return c;
      });

      const d = a?.filter((item) => item.key !== 'actions');

      return d;
    },

    moduleId() {
      return this.$store.getters['program/current'].name;
    },

    id() {
      const [{ value }] = this.fields.filter((item) => item.key === 'id');

      return value;
    },
  },

  methods: {
    resolveValue(o, value) {
      const a = Object.keys(o)?.map((key) => ({
        key,
        value: o[key],
      }));

      const b = a.filter((item) => `${item.key}` === `${value}`);

      return b[0]?.value;
    },
  },

  mounted() {},

  components: {
    // BS
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
