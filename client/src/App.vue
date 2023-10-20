<template>
  <div class="content">
    <router-view />
  </div>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import ConfirmPopup from "primevue/confirmpopup";
  import Toast from "primevue/toast";

  export default defineComponent({
    components: { ConfirmPopup, Toast },
    data() {
      return {
        visible: true,
      };
    },
  });
</script>

<style lang="scss" scoped>
  @use "src/styles/vars" as vars;

  .content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 2rem;
    overflow: auto;
  }
</style>
