<template>
  <div class="h-full flex flex-column justify-content-center">
    <PPoll v-if="showPoll" />
    <p v-else class="text-center">There is no vote happening right now.</p>
  </div>
</template>

<script lang="ts">
  import PPoll from "./PPoll.vue";

  export default {
    name: "PPollView",
    components: { PPoll },
    computed: {
      showPoll() {
        return (
          this.$pollAPI.store.settings.openVote ||
          this.$pollAPI.store.settings.showResults
        );
      },
    },
  };
</script>
