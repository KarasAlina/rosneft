<template>
  <div class="flip-table-wrapper">
    <div ref="flipTable" @scroll="onScroll" class="flip-table">
      <slot />
    </div>

    <transition name="fade">
      <div
        @mouseover="onMouseover(true)"
        v-if="scrollHelperEnd"
        class="flip-table-action"/>
    </transition>

    <transition name="fade">
      <div
        @mouseover="onMouseover()"
        v-if="scrollHelperStart"
        class="flip-table-action -left"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FlipTable',

  data() {
    return {
      scrollHelperEnd: false,
      scrollHelperStart: false,
    };
  },

  methods: {
    onMouseover(right) {
      const { flipTable } = this.$refs;

      flipTable.scroll({
        top: 0,
        left: right ? 1000 : 0,
        behavior: 'smooth',
      });
    },

    showScrollHelpers(e) {
      this.scrollHelperStart = null;

      this.scrollHelperEnd = null;

      const { currentTarget } = e;

      const { scrollLeft } = currentTarget;

      const { offsetWidth } = currentTarget;

      const { scrollWidth } = currentTarget;

      if (scrollWidth <= offsetWidth) return;

      if (scrollLeft <= 0) {
        this.scrollHelperEnd = true;
      } else if (((scrollLeft + offsetWidth) >= scrollWidth) && (scrollWidth > offsetWidth)) {
        this.scrollHelperStart = true;
      }
    },

    resetScrollHelpers() {
      this.scrollHelperEnd = false;
      this.scrollHelperStart = false;
    },

    onScroll(e) {
      this.showScrollHelpers(e);
    },

    initScrollHelpers() {
      const event = new Event('scroll');

      const { flipTable } = this.$refs;

      if (!flipTable) return;

      flipTable.dispatchEvent(event);
    },

    initResizeObserver() {
      const resizeObserver = new ResizeObserver(() => {
        this.initScrollHelpers();

        const { flipTable } = this.$refs;

        flipTable.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });

      resizeObserver.observe(this.$refs.flipTable);
    },
  },

  mounted() {
    this.initResizeObserver();
  },

  activated() {
    this.initScrollHelpers();
  },

  deactivated() {
    this.resetScrollHelpers();
  },

  updated() {
    // this.initScrollHelpers();
  },
};
</script>

<style lang="scss" scoped>
.flip-table-wrapper {
  position: relative;
  overflow: hidden;
}

.flip-table {
  transform: rotateX(180deg);
  overflow: auto;
  position: relative;
}

.flip-table > table {
  transform: rotateX(180deg);
}

.flip-table-action {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30%;
  filter: opacity(50%);
  background: url('data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2042%2081%22%3E%3Cpath%20fill%3D%22%23535c69%22%20opacity%3D%220.3%22%20d%3D%22M40.024%2C0H42a0%2C0%2C0%2C0%2C1%2C0%2C0V81a0%2C0%2C0%2C0%2C1%2C0%2C0H40.977A40.977%2C40.977%2C0%2C0%2C1%2C0%2C40.024v0A40.024%2C40.024%2C0%2C0%2C1%2C40.024%2C0Z%22/%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M20.2%2C31.91l8.014%2C8.576L20.2%2C49.061a0.762%2C0.762%2C0%2C0%2C0%2C0%2C1.026l1.563%2C1.672a0.647%2C0.647%2C0%2C0%2C0%2C.958%2C0l8.014-8.576h0L32.776%2C41a0.762%2C0.762%2C0%2C0%2C0%2C0-1.025L22.72%2C29.212a0.647%2C0.647%2C0%2C0%2C0-.958%2C0L20.2%2C30.885A0.762%2C0.762%2C0%2C0%2C0%2C20.2%2C31.91Z%22/%3E%3C/svg%3E%0A') center right no-repeat;
  z-index: 1;

  &.-left {
    right: auto;
    left: 0;
    background: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2042%2081%22%3E%3Cpath%20fill%3D%22%23535c69%22%20opacity%3D%220.3%22%20d%3D%22M0%2C0H1.023A40.977%2C40.977%2C0%2C0%2C1%2C42%2C40.977v0A40.024%2C40.024%2C0%2C0%2C1%2C1.977%2C81H0a0%2C0%2C0%2C0%2C1%2C0%2C0V0A0%2C0%2C0%2C0%2C1%2C0%2C0Z%22/%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M20.8%2C49.09l-8.014-8.576L20.8%2C31.939a0.762%2C0.762%2C0%2C0%2C0%2C0-1.026l-1.563-1.673a0.647%2C0.647%2C0%2C0%2C0-.959%2C0l-8.014%2C8.576h0L8.224%2C40a0.762%2C0.762%2C0%2C0%2C0%2C0%2C1.026L18.28%2C51.788a0.647%2C0.647%2C0%2C0%2C0%2C.959%2C0L20.8%2C50.116A0.761%2C0.761%2C0%2C0%2C0%2C20.8%2C49.09Z%22/%3E%3C/svg%3E') center left no-repeat;
  }
}
</style>
