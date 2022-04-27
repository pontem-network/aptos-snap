import {EmptyMetamaskState, MetamaskState, Wallet} from "./interfaces";
import {getAddress} from "./rpc/getAddress";
import {exportPrivateKey} from "./rpc/exportPrivateKey";
import {getPublicKey} from "./rpc/getPublicKey";
import {getApi} from "./filecoin/api";
import {AptosRPCApi} from "./filecoin/types";
import {getBalance} from "./rpc/getBalance";
import {configure} from "./rpc/configure";
import {getMessages} from "./rpc/getMessages";
import {signMessage, signMessageRaw} from "./rpc/signMessage";
import {sendMessage} from "./rpc/sendMessage";
import {updateMessagesStatus} from "./rpc/updateMessagesStatus";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  let state = await wallet.request<MetamaskState>({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = EmptyMetamaskState();
    // initialize state if empty and set default config
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  let api: AptosRPCApi = await getApi(wallet);

  switch (requestObject.method) {
    case "fil_configure":
      const resp = await configure(
        wallet, requestObject.params.configuration.network, requestObject.params.configuration
      );
      api = resp.api;
      return resp.snapConfig;
    case "fil_getAddress":
      return await getAddress(wallet);
    case "fil_getPublicKey":
      return await getPublicKey(wallet);
    case "fil_exportPrivateKey":
      return exportPrivateKey(wallet);
    case "fil_getBalance":
      return getBalance(wallet, api);
    case "fil_getMessages":
      return getMessages(wallet);
    case "fil_signMessage":
      return await signMessage(wallet, api, requestObject.params.message);
    case "fil_signMessageRaw":
      return await signMessageRaw(wallet, requestObject.params.message);
    case "fil_sendMessage":
      return await sendMessage(wallet, api, requestObject.params.signedMessage);
    case "fil_updateMessagesStatus":
      return await updateMessagesStatus(wallet, api);
    default:
      throw new Error("Unsupported RPC method");
  }
});
