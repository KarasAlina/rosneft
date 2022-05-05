<template>
  <ContentLoader
      :width="488"
      :height="240"
      :speed="2"
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
  >
    <rect x="0" y="194" rx="4" ry="4" width="220" height="38" />
    <rect x="379" y="3" rx="4" ry="4" width="109" height="25" />
    <rect x="0" y="5" rx="4" ry="4" width="70" height="24" />
    <rect x="0" y="36" rx="4" ry="4" width="117" height="17" />
    <rect x="0" y="58" rx="4" ry="4" width="143" height="17" />
    <rect x="0" y="98" rx="4" ry="4" width="166" height="24" />
    <rect x="280" y="39" rx="4" ry="4" width="10" height="193" />
    <rect x="300" y="79" rx="4" ry="4" width="10" height="153" />
    <rect x="320" y="79" rx="4" ry="4" width="10" height="153" />
    <rect x="340" y="79" rx="4" ry="4" width="10" height="153" />
    <rect x="360" y="79" rx="4" ry="4" width="10" height="153" />
    <rect x="380" y="99" rx="4" ry="4" width="10" height="133" />
  </ContentLoader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  components: {
    ContentLoader,
  },
};
</script>
