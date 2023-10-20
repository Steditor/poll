import { NavigationGuardWithThis } from "vue-router";

import { vm } from "../main";
import { JoinPollResult } from "../pollAPI/PollAPI";

export const connectToRoom: NavigationGuardWithThis<undefined> = async (
  to,
  from,
  next,
) => {
  if (
    (await vm.$pollAPI.joinPoll(to.params.roomId as string)) ===
    JoinPollResult.SUCCESSFUL
  ) {
    next();
  } else {
    next({ name: "Home" });
  }
};
