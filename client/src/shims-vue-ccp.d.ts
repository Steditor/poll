import { ConfirmationServiceMethods } from "../typings/primeconfirmpopup";
import { ToastServiceMethods } from "../typings/primetoast";
import PollAPI from "./pollAPI/PollAPI";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $pollAPI: PollAPI;
    $confirm: ConfirmationServiceMethods;
    $toast: ToastServiceMethods;
  }
}
