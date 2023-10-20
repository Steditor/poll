import { Client } from "colyseus";

import { ToastMessage } from "@poll/client/typings/primetoast";

export function sendToast(client: Client, message: ToastMessage): void {
  client.send("toast", message);
}
