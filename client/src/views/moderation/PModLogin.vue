<template>
  <div class="p-full-size flex">
    <div class="p-flex-center-wrapper">
      <Card class="login-card">
        <template #title>Login required</template>
        <template #content>
          <div class="field p-fluid">
            <span class="p-float-label p-input-icon-right">
              <i class="pi pi-user" />
              <InputText
                id="moderationKey"
                type="text"
                v-model="moderationKey"
                @keyup.enter="login()"
              />
              <label for="moderationKey">Enter the poll's moderation key</label>
            </span>
          </div>
        </template>
        <template #footer>
          <div class="field p-fluid">
            <Button
              label="Login"
              icon="pi pi-login"
              class="p-button-lg p-button-success"
              @click="login()"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Button from "primevue/button";
  import Card from "primevue/card";
  import InputText from "primevue/inputtext";

  export default defineComponent({
    name: "PModLogin",
    components: { InputText, Button, Card },
    data() {
      return {
        moderationKey: "",
      };
    },
    methods: {
      login() {
        this.$pollAPI.playerAPI.becomeAdmin(this.moderationKey);
      },
    },
  });
</script>

<style lang="scss" scoped>
  .login-card {
    width: 500px;
  }
</style>
