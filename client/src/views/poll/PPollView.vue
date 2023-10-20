<template>
  <div class="h-full flex flex-column justify-content-center">
    <PPoll />
  </div>
</template>

<script lang="ts">
  import PPoll from "./PPoll.vue";

  export default {
    name: "PPollView",
    components: { PPoll },
  };
</script>
