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
        There {{ numberOfPeople === 1 ? "is" : "are" }} currently
        {{ numberOfPeople }} {{ numberOfPeople === 1 ? "person" : "people" }} in
        the poll (including you).
      </p>
      <p>
        If you want to allow others to moderate this poll, send them the
        moderation key in addition to the poll link:
        <PCopyable :content="moderationKey" secret />.
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
      pollLink(): string {
        return (
          document.location.protocol +
          "//" +
          document.location.host +
          this.$router.resolve(this.pollRoute).fullPath
        );
      },
      numberOfPeople() {
        return this.$pollAPI.store.numberOfPlayers;
      },
    },
  });
</script>

<style lang="scss">
  .qr-dialog .p-dialog-content {
    display: flex;
  }
</style>
