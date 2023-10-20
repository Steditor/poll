<template>
  <div v-if="isAdmin()" class="grid">
    <div class="col-12 lg:col-6 lg:col-offset-3">
      <PModInfo />
      <PModSettings class="mt-3" />
      <PModResults class="mt-3" />
    </div>
  </div>
  <PModLogin v-else />
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import PModInfo from "./PModInfo.vue";
  import PModLogin from "./PModLogin.vue";
  import PModResults from "./PModResults.vue";
  import PModSettings from "./PModSettings.vue";

  export default defineComponent({
    name: "PModeration",
    components: {
      PModInfo,
      PModLogin,
      PModResults,
      PModSettings,
    },
    methods: {
      isAdmin(): boolean {
        return this.$pollAPI.store.me()?.admin ?? false;
      },
    },
  });
</script>
