<template>
  <div class="poll-container" ref="container">TBA</div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "PPoll",
  });
</script>

<style lang="scss" scoped>
  .poll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    user-select: none;
    touch-action: none;
  }
</style>
