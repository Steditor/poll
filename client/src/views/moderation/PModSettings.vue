<template>
  <Card>
    <template #title>Poll Settings</template>
    <template #content>
      <div class="formgrid">
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-2 sm:mb-3">Options</label>
          <div class="col-6 mb-3 sm:col-4 md:col-3 lg:col-5 xl:col-4">
            <InputNumber
              :min="2"
              :max="255"
              v-model="numberOfOptions"
              :show-buttons="true"
              button-layout="horizontal"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              :input-style="{ width: '4em' }"
            />
          </div>
          <div class="col-6 mb-3 sm:col-4 md:col-3 lg:col-5 xl:col-4">
            <Dropdown
              v-model="numbering"
              :options="LABELED_NUMBERINGS()"
              option-label="label"
              option-value="value"
            />
          </div>
        </div>
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-2 sm:mb-3">Voting</label>
          <div
            class="col-12 mb-3 sm:col-4 md:col-3 lg:col-5 xl:col-4 flex align-items-center"
          >
            Closed
            <InputSwitch v-model="openVote" class="ml-2 mr-2" />
            Open
          </div>
        </div>
        <div class="field grid">
          <label class="col-12 mb-1 sm:col-2 sm:mb-3">Results</label>
          <div
            class="col-6 mb-3 sm:col-4 md:col-3 lg:col-5 xl:col-4 flex align-items-center"
          >
            Hide
            <InputSwitch v-model="showResults" class="ml-2 mr-2" />
            Show
          </div>
          <div class="col-6 mb-3 sm:col-4 md:col-3 lg:col-5 xl:col-4">
            <Button label="Clear Votes" icon="pi pi-undo" @click="clearVotes" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
  import { WritableComputedOptions, defineComponent } from "vue";

  import Button from "primevue/button";
  import Card from "primevue/card";
  import Dropdown from "primevue/dropdown";
  import InputNumber from "primevue/inputnumber";
  import InputSwitch from "primevue/inputswitch";

  import { LABELED_NUMBERINGS } from "@poll/common/roomInterface";

  import { settingsFieldModel } from "../../pollAPI/helpers/fieldModels";

  export default defineComponent({
    name: "PModSettings",
    components: {
      Button,
      Card,
      Dropdown,
      InputNumber,
      InputSwitch,
    },
    computed: {
      numberOfOptions: settingsFieldModel(
        "numberOfOptions",
      ) as WritableComputedOptions<number>,
      numbering: settingsFieldModel(
        "numbering",
      ) as WritableComputedOptions<string>,
      openVote: settingsFieldModel(
        "openVote",
      ) as WritableComputedOptions<boolean>,
      showResults: settingsFieldModel(
        "showResults",
      ) as WritableComputedOptions<boolean>,
    },
    methods: {
      LABELED_NUMBERINGS() {
        return LABELED_NUMBERINGS;
      },
      clearVotes() {
        this.$pollAPI.roomAPI.clearVotes();
      },
    },
  });
</script>
