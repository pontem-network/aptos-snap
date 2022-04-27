import {ExecutedMessage, Message, SignedMessage} from "@pontem/aptosnap-types";
import {
  AptosSigningMessageRequest,
  AptosSubmitTransactionRequest,
  AptosSubmitTransactionResponse
} from "../interfaces";

export function convertMessageToRequest(message: Message): AptosSigningMessageRequest {
  return {
    expiration_timestamp_secs: message.expiration,
    gas_currency_code: message.gasCurrency,
    gas_unit_price: message.gasPrice,
    max_gas_amount: message.gasLimit,
    payload: {
      arguments: message.payload.arguments,
      function: message.payload.function,
      type: message.payload.type,
      type_arguments: message.payload.typeArguments,
    },
    sender: message.sender,
    sequence_number: message.sequenceNumber,
  };
}

export function convertSignedMessageToRequest(message: SignedMessage): AptosSubmitTransactionRequest {
  return {
    ...convertMessageToRequest(message),
    signature: {
      public_key: message.signature.publicKey,
      signature: message.signature.signature,
      type: message.signature.type,
    }
  };
}

export function convertSubmitResponseToExecutedMessage(response: AptosSubmitTransactionResponse): ExecutedMessage {
  return {
    expiration: response.expiration_timestamp_secs,
    gasCurrency: response.gas_currency_code,
    gasLimit: response.max_gas_amount,
    gasPrice: response.gas_unit_price,
    hash: response.hash,
    payload: {
      arguments: response.payload.arguments,
      function: response.payload.function,
      type: response.payload.type,
      typeArguments: response.payload.type_arguments,
    },
    sender: response.sender,
    sequenceNumber: response.sequence_number,
    signature: {
      publicKey: response.signature.public_key,
      signature: response.signature.signature,
      type: response.signature.type,
    },
  };
}
