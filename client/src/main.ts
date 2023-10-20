import { createApp } from "vue";

import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";
import pollAPI from "./pollAPI";
import router from "./router";
import "./styles/styles";

const app = createApp(App);
app.use(pollAPI);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.directive("tooltip", Tooltip);

export const vm = app.mount("#app");
