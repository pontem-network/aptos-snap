import {SignatureType} from "@pontem/aptosnap-types";

export interface AptosBalanceResource {
  coin: {
    value: string
  }
}

export interface AptosAccountResourceResponse<T = never> {
  type: string,
  data: T
}

export interface AptosAccountInfoResponse {
  sequence_number: string;
  authentication_key: string;
}

export interface AptosSigningMessageResponse {
  message: string;
}

export interface AptosSigningMessageRequest {
  sender: string,
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  gas_currency_code: string;
  expiration_timestamp_secs: string;
  payload: {
    type: string;
    function: string;
    type_arguments: string[];
    arguments: string[];
  };
}

export type AptosSubmitTransactionRequest = AptosSigningMessageRequest & {
  signature: {
    type: SignatureType,
    signature: string,
    public_key: string
  }
};

export type AptosSubmitTransactionResponse = AptosSubmitTransactionRequest & { hash: string };
