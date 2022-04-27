import {
  AptosAccountInfoResponse,
  AptosAccountResourceResponse,
  AptosBalanceResource,
  AptosSigningMessageResponse,
  AptosSubmitTransactionResponse,
  AptosSigningMessageRequest,
  Wallet, AptosSubmitTransactionRequest
} from "../interfaces";
import {getConfiguration} from "../configuration";
import {AptosRPCApi} from "./types";
import {Message, SignedMessage, SnapConfig, Transaction} from "@pontem/aptosnap-types";
import axios, {AxiosInstance} from 'axios';
import adapter from '../util/axiosFetchAdapter';

class AptosApi implements AptosRPCApi {
  private readonly client: AxiosInstance;
  private rpcUrl: string;

  constructor(config: { rpcUrl: string }) {
    this.rpcUrl = config.rpcUrl;
    this.client = axios.create({
      adapter,
      baseURL: config.rpcUrl,
    });
  }

  public async walletBalance(address: string): Promise<string> {
    console.log(`APTOS balance for ${address}`);
    // console.log(fetch);
    try {
      // await this.test(address);
      const response = await this.client.get<AptosAccountResourceResponse[]>(`accounts/${address}/resources`);
      console.log('APTOS response', response.data);
      const testResource: AptosAccountResourceResponse<AptosBalanceResource> | undefined = (response.data || [])
        .find((resource: { type: string }) => resource.type === '0x1::TestCoin::Balance');

      let balance = '0';
      if(testResource) {
        balance = testResource.data.coin.value;
      }

      return balance;
    } catch(e) {
      console.log('APTOS CATCH ERROR', e);
      return '0';
    }
  }

  public test(address: string): void {
    fetch(`${this.rpcUrl}/accounts/${address}/resources`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log('APTOS response', json);
      })
      .catch(err => {
        console.log('APTOS error', err);
      });
  }

  public async getSequenceNumber(address: string): Promise<string> {
    try {
      const account = await this.client.get<AptosAccountInfoResponse>(`accounts/${address}`);

      return account.data.sequence_number;
    } catch (e) {
      return '0';
    }
  }

  public async submitTransaction(message: AptosSubmitTransactionRequest): Promise<AptosSubmitTransactionResponse> {
    return this.client.post<AptosSubmitTransactionResponse>('transactions', message)
      .then(response => response.data);
  }

  public getSigningMessage(message: AptosSigningMessageRequest): Promise<string> {
    return this.client.post<AptosSigningMessageResponse>('transactions/signing_message', message)
      .then(response => response.data.message);
  }

  public getTransaction(hash: string): Promise<Transaction> {
    return this.client.get<Transaction>(`transactions/${hash}`, )
      .then(response => response.data)
      .catch(e => {
        console.log('[Aptos] Fetch transaction error', e);
        return undefined;
      });
  }
}

export async function getApi(wallet: Wallet): Promise<AptosRPCApi> {
  const configuration = await getConfiguration(wallet);
  return getApiFromConfig(configuration);
}

export async function getApiFromConfig(configuration: SnapConfig): Promise<AptosRPCApi> {
  return new AptosApi({rpcUrl: configuration.rpc.url});
}
