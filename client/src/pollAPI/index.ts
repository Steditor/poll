import { App } from "vue";

import PollAPI from "./PollAPI";

export default {
  install: (app: App): void => {
    app.config.globalProperties.$pollAPI = new PollAPI();
  },
};
