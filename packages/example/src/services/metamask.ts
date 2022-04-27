import {SnapRpcMethodRequest} from "@pontem/aptosnap-types";
import {enableFilecoinSnap, MetamaskFilecoinSnap} from "@pontem/aptosnap-adapter";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            send: <T>(request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<T>;
            on: (eventName: unknown, callback: unknown) => unknown;
            // requestIndex: () => Promise<{getSnapApi: (origin: string) => Promise<FilecoinApi>}>;
        }
    }
}

export const defaultSnapId = 'local:http://localhost:8081';

let isInstalled: boolean = false;

export interface SnapInitializationResponse {
    isSnapInstalled: boolean;
    snap?: MetamaskFilecoinSnap;
}

export async function initiateFilecoinSnap(): Promise<SnapInitializationResponse> {
    const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
    try {
        console.log('Attempting to connect to snap...');
        const metamaskFilecoinSnap = await enableFilecoinSnap({network: "aptos"}, snapId, {version: "latest"});
        isInstalled = true;
        console.log('Snap installed!');
        return {isSnapInstalled: true, snap: metamaskFilecoinSnap};
    } catch (e) {
        console.error(e);
        isInstalled = false;
        return {isSnapInstalled: false};
    }
}

export async function isFilecoinSnapInstalled(): Promise<boolean> {
    return isInstalled;
}
