import {MetamaskState, Wallet} from "../interfaces";
import {MessageStatus} from "@pontem/aptosnap-types";

export async function updateMessageInState(wallet: Wallet, message: MessageStatus): Promise<void> {
  const state = await wallet.request<MetamaskState>({ method: 'snap_manageState', params: ['get'] });
  const index = state.filecoin.messages.findIndex(msg => msg.cid === message.cid);
  if (index >= 0) {
    state.filecoin.messages[index] = message;
  } else {
    state.filecoin.messages.push(message);
  }
  await wallet.request({
    method: 'snap_manageState',
    params: ['update', state]
  });
}
