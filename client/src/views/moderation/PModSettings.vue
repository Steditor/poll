<template>
  <Card>
    <template #title>Poll Settings</template>
    <template #content>
      <div class="formgrid">
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-4 sm:mb-3">Number of Options</label>
          <div class="col-12 mb-3 sm:col-8">
            <InputNumber
              :min="2"
              v-model="numberOfOptions"
              show-buttons="show-buttons"
              button-layout="horizontal"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
        </div>
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-4 sm:mb-3">Voting</label>
          <div class="col-12 mb-3 sm:col-8">
            Closed
            <InputSwitch v-model="openVote" class="ml-2 mr-2" />
            Open
          </div>
        </div>
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-4 sm:mb-3">Results</label>
          <div class="col-12 mb-3 sm:col-8">
            Hide
            <InputSwitch v-model="showResults" class="ml-2 mr-2" />
            Show
          </div>
        </div>
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-4 sm:mb-3">Reset</label>
          <div class="col-12 mb-3 sm:col-8">
            <Button label="Clear Votes" icon="pi pi-undo" @click="clearVotes" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Button from "primevue/button";
  import Card from "primevue/card";
  import InputNumber from "primevue/inputnumber";
  import InputSwitch from "primevue/inputswitch";

  import { settingsFieldModel } from "../../pollAPI/helpers/fieldModels";

  export default defineComponent({
    name: "PModSettings",
    components: {
      Card,
      InputNumber,
      InputSwitch,
      Button,
    },
    computed: {
      numberOfOptions: settingsFieldModel("numberOfOptions"),
      openVote: settingsFieldModel("openVote"),
      showResults: settingsFieldModel("showResults"),
    },
    methods: {
      clearVotes() {
        this.$pollAPI.roomAPI.clearVotes();
      },
    },
  });
</script>
