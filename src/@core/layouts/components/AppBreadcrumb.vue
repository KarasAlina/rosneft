<template>
  <b-row
    v-if="currentProgram && ($route.meta.breadcrumb || $route.meta.pageTitle)"
    class="content-header"
  >

    <!-- Content Left -->
    <b-col
      class="content-header-left mb-2"
      cols="12"
      md="9"
    >
      <b-row class="breadcrumbs-top">
        <b-col cols="12" class="d-flex align-items-baseline">
          <h2
              :class="{ 'border-0': !$route.meta.breadcrumb }"
              class="content-header-title float-left pr-2 mb-0 mr-1">
            {{$route.meta.pageTitle || currentProgram.title}}
          </h2>
          <div class="breadcrumb-wrapper">
            <b-breadcrumb>
              <b-breadcrumb-item
                :active="true"
                v-if="$route.meta.campaign"
              >
                {{ currentProgram.title }}
              </b-breadcrumb-item>
              <b-breadcrumb-item
                v-for="item in $route.meta.breadcrumb"
                :key="item.text"
                :active="item.active"
                :to="item.to"
              >
                {{ item.text }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import {
  BBreadcrumb, BBreadcrumbItem, BRow, BCol,
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
  computed: {
    currentProgram() {
      return this.$store.getters['program/current'];
    },
  },

  directives: {
    Ripple,
  },

  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BRow,
    BCol,
  },
};
</script>

<style lang="sass" scoped></style>
