<template>
  <Card>
    <template #title>Poll Results</template>
    <template #content>
      <PPoll :readonly="true" class="compact" />
    </template>
  </Card>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Card from "primevue/card";

  import PPoll from "../poll/PPoll.vue";

  export default defineComponent({
    name: "PModResults",
    components: { PPoll, Card },
    methods: {
      votes(i: number): number {
        return this.$pollAPI.store.votes.get(i.toString()) ?? 0;
      },
    },
  });
</script>
