<template>
  <ol
    class="poll-container"
    role="list"
    style="--p-option-style: lower-alpha"
    :style="{ '--p-max-votes': maxVotes }"
  >
    <PVoteOption
      v-for="n in $pollAPI.store.settings.numberOfOptions"
      :index="n - 1"
      :key="n - 1"
      :readonly="readonly"
    />
  </ol>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import PVoteOption from "./PVoteOption.vue";

  export default defineComponent({
    name: "PPoll",
    components: { PVoteOption },
    props: {
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      maxVotes(): number {
        return Math.max(...this.$pollAPI.store.votes.values());
      },
    },
  });
</script>

<style lang="scss" scoped>
  .poll-container {
    margin: 0;
    padding: 0;

    display: grid;
    row-gap: 1rem;
    align-content: stretch;

    height: 100%;
    overflow-y: auto;

    user-select: none;

    list-style-type: none;
    counter-reset: option-index;

    &.compact {
      row-gap: 0;
      .p-vote-option {
        background: var(--surface-a);
      }
    }
  }
</style>
