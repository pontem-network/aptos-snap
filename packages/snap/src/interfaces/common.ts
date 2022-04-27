import {MessageStatus, MetamaskFilecoinRpcRequest, SnapConfig} from "@pontem/aptosnap-types";
import {defaultConfiguration} from "../configuration/predefined";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskFilecoinRpcRequest
) => Promise<unknown>;

export type MetamaskState = {
  filecoin: {
    config: SnapConfig;
    messages: MessageStatus[];
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  filecoin: {config: defaultConfiguration, messages: []}
});

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  request<T = unknown>(options: {method: string; params?: unknown[]}): Promise<T>;
}
