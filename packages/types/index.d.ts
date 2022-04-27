export interface GetPublicKeyRequest{
  method: "fil_getPublicKey";
}

export interface GetAddressRequest {
  method: "fil_getAddress";
}

export interface ExportSeedRequest {
  method: "fil_exportPrivateKey";
}

export interface UpdateMessagesStatusRequest {
  method: "fil_updateMessagesStatus";
}

export interface ConfigureRequest {
  method: "fil_configure";
  params: {
    configuration: SnapConfig;
  };
}

export interface SignMessageRequest {
  method: "fil_signMessage";
  params: {
    message: MessageRequest;
  };
}

export interface SignMessageRawRequest {
  method: "fil_signMessageRaw";
  params: {
    message: string;
  };
}

export interface SendMessageRequest {
  method: "fil_sendMessage";
  params: {
    signedMessage: SignedMessage;
  };
}

export interface GetBalanceRequest {
  method: "fil_getBalance";
}

export interface GetMessagesRequest {
  method: "fil_getMessages";
}

export interface GetGasForMessageRequest {
  method: "fil_getGasForMessage";
  params: {
    message: MessageRequest;
    maxFee?: string;
  };
}

export type MetamaskFilecoinRpcRequest =
    GetPublicKeyRequest |
    GetAddressRequest |
    ExportSeedRequest |
    ConfigureRequest |
    GetBalanceRequest |
    GetMessagesRequest |
    SignMessageRequest |
    SignMessageRawRequest |
    SendMessageRequest |
    UpdateMessagesStatusRequest |
    GetGasForMessageRequest;

type Method = MetamaskFilecoinRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}

export interface GetSnapsRequest {
  method: "wallet_getSnaps";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskFilecoinRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetSnapsRequest | SnapRpcMethodRequest;

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  derivationPath: string;
  network: FilecoinNetwork;
  rpc: {
    token: string;
    url: string;
  };
  unit?: UnitConfiguration;
}

export type Callback<T> = (arg: T) => void;

// Filecoin types

export interface Message {
  sender: string,
  sequenceNumber: string;
  gasLimit: string;
  gasPrice: string;
  gasCurrency: string;
  expiration: string;
  payload: {
    type: string;
    function: string;
    typeArguments: string[];
    arguments: string[];
  };
}

export type SignedMessage = Message & { signature: MessageSignature };
export type ExecutedMessage = SignedMessage & { hash: string };

export interface MessageSignature {
  type: SignatureType;
  publicKey: string;
  signature: string;
}

export interface SignMessageResponse {
  signedMessage: SignedMessage
  confirmed: boolean
  error: Error
}

export interface SignRawMessageResponse {
  signature: string
  confirmed: boolean
  error: Error
}

export interface MessageRequest {
  sequenceNumber?: string;
  gasLimit: string;
  gasPrice: string;
  gasCurrency?: string;
  expiration?: string;
  payload: {
    type: string;
    function: string;
    typeArguments: string[];
    arguments: string[];
  };
}

export interface MessageGasEstimate {
  gaslimit: number;
  gasfeecap: string;
  gaspremium: string;
  maxfee: string;
}

export type TransactionStatus = 'created' | 'pending' | 'failed' | 'successful';
export type SignatureType = 'ed25519_signature';

export interface UserTransaction {
  type: string;
  version: string,
  hash: string,
  state_root_hash: string,
  event_root_hash: string,
  gas_used: string,
  success: boolean,
  vm_status: string,
  accumulator_root_hash: string,
  sender: string,
  sequence_number: string,
  max_gas_amount: string,
  gas_unit_price: string,
  gas_currency_code: string,
  expiration_timestamp_secs: string,
  payload: {
    type: string,
    function: string,
    type_arguments: string[],
    arguments: string[],
  },
  signature: MessageSignature,
  events: unknown[],
  timestamp: string
}

export type Transaction = UserTransaction;

export interface MessageStatus {
  message: ExecutedMessage;
  transaction: Transaction; // TODO create base interface for tx and create union with other types
  status: TransactionStatus;
  cid: string;
}

export type FilecoinNetwork = "f" | "t" | "aptos";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FilecoinEventApi {}

export interface FilecoinSnapApi {
  getPublicKey(): Promise<string>;
  getAddress(): Promise<string>;
  getBalance(): Promise<string>;
  exportPrivateKey(): Promise<string>;
  configure(configuration: Partial<SnapConfig>): Promise<void>;
  signMessage(message: MessageRequest): Promise<SignMessageResponse>;
  signMessageRaw(message: string): Promise<SignRawMessageResponse>;
  sendMessage(signedMessage: SignedMessage): Promise<MessageStatus>;
  getMessages(): Promise<MessageStatus[]>;
  updateMessagesStatus(): Promise<MessageStatus[]>;
  calculateGasForMessage(message: MessageRequest, maxFee?: string): Promise<MessageGasEstimate>;
}

export interface KeyPair {
  address: string;
  privateKey: string;
  publicKey: string;
}
