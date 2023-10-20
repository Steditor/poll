<template>
  <div class="p-full-size flex">
    <div class="p-flex-center-wrapper">
      <router-link
        v-if="$pollAPI.store.roomId"
        :to="{ name: 'Poll', params: { roomId: $pollAPI.store.roomId } }"
        custom
        v-slot="{ navigate }"
      >
        <Button
          @click="navigate"
          label="Go back to your current Poll"
          icon="pi pi-chevron-left"
          iconPos="left"
          class="p-button-text mb-2"
        />
      </router-link>
      <div class="p-card login-card">
        <Accordion :active-index="0">
          <AccordionTab>
            <template #header>
              <i class="pi pi-sign-in"></i>
              <span class="ml-3">Join a Poll</span>
            </template>
            <PJoinPanel />
          </AccordionTab>
          <AccordionTab>
            <template #header>
              <i class="pi pi-plus"></i>
              <span class="ml-3">Create a Poll</span>
            </template>
            <PCreatePanel />
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Accordion from "primevue/accordion";
  import AccordionTab from "primevue/accordiontab";
  import Button from "primevue/button";

  import PCreatePanel from "./PCreatePanel.vue";
  import PJoinPanel from "./PJoinPanel.vue";

  export default defineComponent({
    name: "PHome",
    components: { PCreatePanel, PJoinPanel, Accordion, AccordionTab, Button },
  });
</script>

<style lang="scss" scoped>
  .login-card {
    max-width: 500px;
    min-width: 300px;
  }
  i,
  span {
    vertical-align: middle;
  }
</style>
