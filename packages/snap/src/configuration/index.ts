import {MetamaskState, Wallet} from "../interfaces";
import {
  aptosDevnetConfiguration,
  defaultConfiguration,
  filecoinMainnetConfiguration,
  filecoinTestnetConfiguration
} from "./predefined";
import {SnapConfig} from "@pontem/aptosnap-types";

export function getDefaultConfiguration(networkName?: string): SnapConfig {
  switch (networkName) {
    case "aptos":
      console.log("Aptos Devnet network selected");
      return aptosDevnetConfiguration;
    case "f":
      console.log("Filecoin mainnett network selected");
      return filecoinMainnetConfiguration;
    case "t":
      console.log("Filecoin testnet network selected");
      return filecoinTestnetConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(wallet: Wallet): Promise<SnapConfig> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  }) as MetamaskState;
  if (!state || !state.filecoin.config) {
    return defaultConfiguration;
  }
  return state.filecoin.config;
}
