<template>
  <li
    class="p-vote-option p-component"
    :class="{
      'p-open-vote': openVote,
      'p-show-results': showResults,
      'p-chosen': chosen,
      'p-abstention': abstention,
    }"
    @click="sendVote()"
  >
    <i v-if="chosen" class="pi pi-chevron-right p-vote-indicator"></i>
    <i v-if="loading" class="pi pi-spin pi-spinner p-vote-indicator"></i>
    <span class="p-vote-option-label"></span>
    <div
      class="p-vote-result"
      :style="{ width: 'calc(' + 100 * numVotes + '% / var(--p-max-votes))' }"
    ></div>
    <span class="p-vote-result-numbers"
      >{{ percVotes }}&thinsp;% ({{ numVotes }})</span
    >
  </li>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "PVoteOption",
    props: {
      index: {
        type: Number,
        required: true,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      abstention: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      chosen() {
        return (
          !this.$pollAPI.store.me()?.admin &&
          (this.index === this.$pollAPI.store.me()?.vote ||
            this.index === this.$pollAPI.store.local.sentVote)
        );
      },
      loading() {
        return (
          !this.$pollAPI.store.me()?.admin &&
          this.index === this.$pollAPI.store.local.sentVote &&
          this.index !== this.$pollAPI.store.me()?.vote
        );
      },
      showResults() {
        return (
          this.$pollAPI.store.me()?.admin ||
          this.$pollAPI.store.settings.showResults
        );
      },
      numVotes(): number {
        return this.$pollAPI.store.votes.get(this.index.toString()) ?? 0;
      },
      percVotes(): number {
        return this.$pollAPI.store.numberOfVoters.value > 0
          ? Math.round(
              (this.numVotes / this.$pollAPI.store.numberOfVoters.value) * 100,
            )
          : 0;
      },
      openVote(): boolean {
        return this.$pollAPI.store.settings.openVote && !this.readonly;
      },
    },
    methods: {
      sendVote() {
        if (this.openVote) {
          this.$pollAPI.playerAPI.vote(this.index);
        }
      },
    },
  });
</script>
<style lang="scss" scoped>
  .p-vote-option {
    display: grid;
    grid-template-columns: 2em 2em 1fr;
    grid-template-areas: "indicator label content";
    align-items: center;

    color: var(--primary-color);
    background: var(--surface-b);
    border-radius: 4px;
    padding: 0.714rem 1rem;

    &.p-open-vote {
      cursor: pointer;
      background: var(--surface-a);

      &:hover,
      &.p-chosen {
        box-shadow: inset 0 0 0 1px;
      }
      &:hover {
        background: color-mix(
          in hsl,
          var(--surface-a) 95%,
          var(--primary-color)
        );
      }
    }

    .p-vote-indicator {
      grid-area: indicator;
      justify-self: center;
    }

    .p-vote-option-label {
      grid-area: label;
      justify-self: right;
      padding-right: 0.5rem;
      &::before {
        counter-increment: option-index;
        content: counter(option-index, var(--p-option-style)) ".";
      }
    }

    .p-vote-result {
      grid-area: content;
      align-self: stretch;
      background: var(--primary-color);
      transition: width 0.2s ease-in-out;
      min-height: 2rem;
    }

    .p-vote-result-numbers {
      grid-area: content;
      justify-self: left;

      color: var(--primary-color);
      background: inherit;

      border-radius: 0.75rem;
      padding: 0 0.5rem;
      margin-left: 0.5rem;
      min-width: 1.5rem;
      line-height: 1.5rem;

      font-size: 0.75rem;
      text-align: center;
      visibility: hidden;
    }
    &.p-show-results .p-vote-result-numbers {
      visibility: visible;
    }

    &.p-abstention {
      .p-vote-option-label::before {
        counter-increment: option-index 0;
        content: "—";
      }
      .p-vote-result {
        background: var(--primary-900);
      }
    }
  }
</style>
