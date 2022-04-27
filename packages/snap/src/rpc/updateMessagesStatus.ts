import {MetamaskState, Wallet} from "../interfaces";
import {MessageStatus, Transaction} from "@pontem/aptosnap-types";
import {AptosRPCApi} from "../filecoin/types";
import {updateMessageInState} from "../filecoin/message";

export async function updateMessagesStatus(wallet: Wallet, api: AptosRPCApi): Promise<MessageStatus[]> {
  const state = await wallet.request<MetamaskState>({ method: 'snap_manageState', params: ['get'] });

  const uncompleted = state?.filecoin?.messages?.filter(message => ['created', 'pending'].includes(message.status));

  const promises = uncompleted.map(message => {
    return api.getTransaction(message.cid)
      .then((tx: Transaction) => {
        if(!tx) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return;
        }

        if(tx.type === 'pending_transaction') {
          message.status = 'pending';
        } else if(tx.success) {
          message.status = 'successful';
        } else {
          message.status = 'failed';
        }

        message.transaction = tx;

        return updateMessageInState(wallet, message);
      });
  });

  await Promise.all(promises);

  return uncompleted;
}
