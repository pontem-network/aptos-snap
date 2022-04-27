import * as Nacl from "tweetnacl";
import {isHexPrefixed} from "./hex";
import {SignatureType} from "@pontem/aptosnap-types";

interface SignOptions {
  message: string;
  privateKey: string;
}

interface SignResult {
  type: SignatureType,
  signature: string
}

export function transactionSign({ message, privateKey }: SignOptions): SignResult {
  const toSign = Buffer.from(isHexPrefixed(message) ? message.substring(2) : message, "hex");
  const signature = Nacl.sign(toSign, Uint8Array.from(Buffer.from(privateKey, 'hex')));

  return {
    signature: Buffer.from(signature).toString("hex").slice(0, 128),
    type: 'ed25519_signature',
  };
}
