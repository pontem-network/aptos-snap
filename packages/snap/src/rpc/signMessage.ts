import { transactionSignRaw} from "@zondax/filecoin-signing-tools/js";
import {Wallet} from "../interfaces";
import {getKeyPair} from "../filecoin/account";
import {showConfirmationDialog} from "../util/confirmation";
import {AptosRPCApi} from "../filecoin/types";
import {
  Message,
  MessageRequest,
  SignedMessage,
  SignMessageResponse,
  SignRawMessageResponse
} from "@pontem/aptosnap-types";
import {messageCreator} from "../util/messageCreator";
import {transactionSign} from "../util/transactionSign";
import {convertMessageToRequest} from "../util/convertTypes";

export async function signMessage(
  wallet: Wallet, api: AptosRPCApi, messageRequest: MessageRequest
): Promise<SignMessageResponse> {
  try {
    const keypair = await getKeyPair(wallet);

    // extract gas params
    const sequenceNumber = messageRequest.sequenceNumber ?? await api.getSequenceNumber(keypair.address);
    const gasCurrency = messageRequest.gasCurrency ?? 'XUS';
    const expiration = messageRequest.expiration ?? '' + Date.now() + 5 * 60 * 1000; // 5 minutes

    // create message object
    const message: Message = {
      expiration,
      gasCurrency,
      gasLimit: messageRequest.gasLimit,
      gasPrice: messageRequest.gasPrice,
      payload: messageRequest.payload,
      sender: keypair.address,
      sequenceNumber,
    };

    // show confirmation
    const confirmation = await showConfirmationDialog(
      wallet,
      {
        description: `It will be signed with address: ${message.sender}`,
        prompt: `Do you want to sign this message?`,
        textAreaContent: messageCreator(
          [
            // {message: 'to:', value: message.to},
            {message: 'from:', value: message.sender},
            // {message: 'value:', value: message.value !== '0'
            //   && `${new FilecoinNumber(message.value, 'attofil').toFil()} FIL`},
            {message: 'type:', value: message.payload.type},
            {message: 'function:', value: message.payload.function},
            {message: 'arguments:', value: message.payload.arguments.join("\n")},
            {message: 'gas limit:', value: `${message.gasLimit}`},
            {message: 'gas price:', value: `${message.gasPrice}`},
          ]
        )
      },
    );

    let sig: SignedMessage = null;
    if (confirmation) {
      const requestMessage = convertMessageToRequest(message);
      const toSign = await api.getSigningMessage(requestMessage);

      sig = {
        ...message,
        signature: {
          ...transactionSign({message: toSign, privateKey: keypair.privateKey}),
          publicKey: keypair.publicKey,
        }
      };
    }

    return {confirmed: confirmation, error: null, signedMessage: sig};
  } catch (e) {
    console.log('[Aptos] Error on signing message', e);
    return {confirmed: false, error: e, signedMessage: null};
  }
}

export async function signMessageRaw(wallet: Wallet, rawMessage: string): Promise<SignRawMessageResponse> {
  try {
    const keypair = await getKeyPair(wallet);
    const confirmation = await showConfirmationDialog(
      wallet,
      {
        description: `It will be signed with address: ${keypair.address}`,
        prompt: `Do you want to sign this message?`,
        textAreaContent: rawMessage,
      }
    );

    let sig: string = null;
    if (confirmation) {
      sig = transactionSignRaw(rawMessage, keypair.privateKey).toString("base64");
    }

    return {confirmed: confirmation, error: null, signature: sig};
  } catch (e) {
    return {confirmed: false, error: e, signature: null};
  }
}
