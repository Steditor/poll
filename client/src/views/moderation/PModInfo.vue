<template>
  <Card>
    <template #title>Poll Information</template>
    <template #content>
      <p>
        You're currently moderating poll <PCopyable :content="roomId" />. Others
        can join the poll with this key. They can also use the link
        <PCopyable :content="pollLink"
          ><RouterLink :to="pollRoute" target="_blank">{{
            pollLink
          }}</RouterLink></PCopyable
        >
        or scan <a href="#" @click="showQRCode = true">this QR-Code</a>.
        <Dialog
          header="Poll QRCode"
          v-model:visible="showQRCode"
          modal
          dismissable-mask
          class="qr-dialog"
        >
          <PQRCode :content="pollLink" :options="{ scale: 20 }" />
        </Dialog>
      </p>
      <p>
        There {{ numberOfVoters.value === 1 ? "is" : "are" }} currently
        {{ numberOfVoters }}
        {{ numberOfVoters.value === 1 ? "voter" : "voters" }} in the poll.
      </p>
      <p>
        If you want to allow others to moderate this poll, send them the
        moderation link (<PCopyable :content="moderationLink"
          ><RouterLink :to="moderationRoute" target="_blank">{{
            moderationLink
          }}</RouterLink></PCopyable
        >) and the moderation key (<PCopyable
          :content="moderationKey"
          secret
        />).
      </p>
    </template>
  </Card>
</template>

<script lang="ts">
  import { RouteLocationRaw } from "vue-router";

  import { defineComponent } from "vue";

  import Card from "primevue/card";
  import Dialog from "primevue/dialog";

  import PCopyable from "../../components/PCopyable.vue";
  import PQRCode from "../../components/PQRCode.vue";

  export default defineComponent({
    name: "PModInfo",
    components: { PQRCode, PCopyable, Card, Dialog },
    data() {
      return {
        showQRCode: false,
      };
    },
    computed: {
      roomId(): string {
        return this.$pollAPI.store.roomId ?? "";
      },
      moderationKey(): string {
        return this.$pollAPI.store.settings.moderationKey ?? "";
      },
      pollRoute(): RouteLocationRaw {
        return {
          name: "Poll",
          params: { roomId: this.$pollAPI.store.roomId ?? "" },
        };
      },
      moderationRoute(): RouteLocationRaw {
        return {
          name: "Moderation",
          params: { roomId: this.$pollAPI.store.roomId ?? "" },
        };
      },
      pollLink(): string {
        return (
          document.location.protocol +
          "//" +
          document.location.host +
          this.$router.resolve(this.pollRoute).fullPath
        );
      },
      moderationLink(): string {
        return (
          document.location.protocol +
          "//" +
          document.location.host +
          this.$router.resolve(this.moderationRoute).fullPath
        );
      },
      numberOfVoters() {
        return this.$pollAPI.store.numberOfVoters;
      },
    },
  });
</script>

<style lang="scss">
  .qr-dialog .p-dialog-content {
    display: flex;
  }
</style>
