import {Wallet} from "../interfaces";
import {getKeyPair} from "../filecoin/account";
import {AptosRPCApi} from "../filecoin/types";

export async function getBalance(wallet: Wallet, api: AptosRPCApi, address?: string): Promise<string> {
  if(!address) {
    address = (await getKeyPair(wallet)).address;
  }
  console.log('CALL GET BALANCE', api);

  return await api.walletBalance(address);
}
