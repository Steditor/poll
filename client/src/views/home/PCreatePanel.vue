<template>
  <p>You want to create a new Poll for you and your friends?</p>
  <div class="field p-fluid">
    <Button
      label="Create Poll"
      icon="pi pi-plus"
      class="p-button-lg p-button-success"
      @click="createPoll()"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Button from "primevue/button";

  export default defineComponent({
    name: "PCreatePanel",
    components: { Button },
    methods: {
      async createPoll(): Promise<void> {
        const roomId = await this.$pollAPI.createPoll();
        if (roomId) {
          await this.$router.push({ name: "Moderation", params: { roomId } });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Your poll could not be created.",
            detail:
              "Maybe the server is not working properly right now, or your browser or your connection does not fully support WebSockets.",
          });
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  i,
  span {
    vertical-align: middle;
  }
</style>
