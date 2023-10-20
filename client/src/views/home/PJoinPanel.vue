<template>
  <p>
    You want to join an existing Poll? The creator can provide you with a direct
    link or send you a code to input here:
  </p>
  <div class="field p-fluid">
    <span class="p-float-label p-input-icon-right">
      <i class="pi pi-key" />
      <InputText
        id="poll-code"
        type="text"
        v-model="pollCode"
        @keyup.enter="joinPoll()"
        :class="pollCodeClass"
      />
      <label for="poll-code">Enter the Poll code</label>
    </span>
    <small class="p-invalid" v-if="roomNotFound">Poll not found.</small>
    <small class="p-invalid" v-if="unknownError"
      >Could not join Poll due to an unknown error.</small
    >
  </div>
  <div class="p-field p-fluid">
    <Button
      label="Enter Poll"
      icon="pi pi-sign-in"
      class="p-button-lg"
      @click="joinPoll()"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Button from "primevue/button";
  import InputText from "primevue/inputtext";

  import { JoinPollResult } from "../../pollAPI/PollAPI";

  export default defineComponent({
    name: "PJoinPanel",
    components: { InputText, Button },
    data() {
      return {
        pollCode: "",
        joinPollResult: JoinPollResult.SUCCESSFUL as JoinPollResult,
      };
    },
    computed: {
      roomNotFound(): boolean {
        return this.joinPollResult === JoinPollResult.ROOM_NOT_FOUND;
      },
      unknownError(): boolean {
        return this.joinPollResult === JoinPollResult.UNKNOWN_ERROR;
      },
      pollCodeClass(): Record<string, boolean> {
        return {
          "p-invalid": this.joinPollResult !== JoinPollResult.SUCCESSFUL,
        };
      },
    },
    methods: {
      async joinPoll(): Promise<void> {
        this.joinPollResult = await this.$pollAPI.joinPoll(this.pollCode);
        if (this.joinPollResult === JoinPollResult.SUCCESSFUL) {
          await this.$router.push({
            name: "Poll",
            params: { roomId: this.pollCode },
          });
        } else if (this.joinPollResult === JoinPollResult.ROOM_NOT_FOUND) {
          this.$toast.add({
            severity: "error",
            summary: "The specified poll was not found.",
            detail: "Are you sure that the poll code is correct?",
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Could not join the poll.",
            detail:
              "Maybe the server is not working properly right now, or your browser or your connection does not fully support WebSockets.",
          });
        }
      },
    },
  });
</script>
