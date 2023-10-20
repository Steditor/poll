import { RouteRecordRaw } from "vue-router";

import PHome from "../views/home/PHome.vue";
import PModeration from "../views/moderation/PModeration.vue";
import PPollView from "../views/poll/PPollView.vue";
import { connectToRoom } from "./helpers";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: PHome,
  },
  {
    path: "/moderation/:roomId",
    name: "Moderation",
    beforeEnter: connectToRoom,
    components: {
      default: PModeration,
    },
  },
  {
    path: "/poll/:roomId",
    name: "Poll",
    beforeEnter: connectToRoom,
    components: {
      default: PPollView,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
