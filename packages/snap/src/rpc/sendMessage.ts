import {MessageStatus, SignedMessage} from "@pontem/aptosnap-types";
import {Wallet} from "../interfaces";
import {AptosRPCApi} from "../filecoin/types";
import {updateMessageInState} from "../filecoin/message";
import {convertSignedMessageToRequest, convertSubmitResponseToExecutedMessage} from "../util/convertTypes";

export async function sendMessage(
  wallet: Wallet, api: AptosRPCApi, signedMessage: SignedMessage
): Promise<MessageStatus> {
  const requestMessage = convertSignedMessageToRequest(signedMessage);
  const response = await api.submitTransaction(requestMessage);
  const responseMessage = convertSubmitResponseToExecutedMessage(response);

  const messageStatus: MessageStatus = {
    cid: response.hash,
    message: responseMessage,
    status: 'created',
    transaction: null,
  };

  updateMessageInState(wallet, messageStatus);
  return messageStatus;
}
