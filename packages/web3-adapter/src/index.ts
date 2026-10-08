/**
 * @eth-hot-wallet/web3-adapter
 *
 * viem-based drop-in for the web3@0.20 + ethjs-provider-signer surface that
 * eth-hot-wallet uses. Preserves behavior (wei-denominated numbers, gasPrice
 * in wei, lightwallet keystore signing with a passwordProvider prompt flow)
 * while removing the web3 0.20 / vendored-signer dependency.
 *
 * Signing model: the app's keystore (eth-lightwallet) holds encrypted keys and
 * exposes `signTransaction(txParams, cb)` which consults `passwordProvider`.
 * The app unlocks the wallet (obtaining the password) then runs a send with
 * the password scoped to that call. This adapter reproduces that with an
 * explicit scoped-password API: `sendEth({ password, ... })` /
 * `erc20Transfer({ password, ... })` set `keystore.passwordProvider` for the
 * duration of the signing call and restore it afterwards.
 */
import {
  createPublicClient,
  http,
  isAddress as viemIsAddress,
  parseEther,
  formatEther,
  parseUnits,
  formatUnits,
  encodeFunctionData,
  erc20Abi,
  type Address,
  type PublicClient,
  type Hex,
} from 'viem';

export { parseEther, formatEther, parseUnits, formatUnits, viemIsAddress as isAddress };

// Minimal structural type for the lightwallet keystore (works for both the
// npm 3.0.1 original and the modernized eth-lightwallet-next).
export interface LightwalletKeystore {
  signTransaction: (txParams: RawTxParams, cb: (err: unknown, signedTx: string) => void) => void;
  getAddresses: () => string[];
  passwordProvider: (cb: (err: unknown, password: string) => void) => void;
}

export interface RawTxParams {
  from: string;
  to?: string;
  value?: string | bigint;
  gas?: string | number | bigint;
  gasPrice?: string | bigint;
  nonce?: string | number;
  data?: string;
}

export interface AdapterConfig {
  rpcUrl: string;
  keystore: LightwalletKeystore;
}

export interface SendEthParams {
  password: string;
  from: string;
  to: string;
  valueWei: bigint;
  gasPriceWei: bigint;
  gas: number;
}

export interface Erc20TransferParams {
  password: string;
  contract: string;
  from: string;
  to: string;
  amount: bigint;
  gasPriceWei: bigint;
  gas: number;
}

const toHexQuantity = (v: string | number | bigint): string => {
  if (typeof v === 'string') return v.startsWith('0x') ? v : `0x${BigInt(v).toString(16)}`;
  return `0x${BigInt(v).toString(16)}`;
};

export interface Web3Adapter {
  publicClient: PublicClient;
  getBalance: (address: string) => Promise<bigint>;
  getBlockNumber: () => Promise<bigint>;
  isAddress: (address: string) => boolean;
  erc20BalanceOf: (contract: string, address: string) => Promise<bigint>;
  sendEth: (params: SendEthParams) => Promise<Hex>;
  erc20Transfer: (params: Erc20TransferParams) => Promise<Hex>;
}

export function createWeb3Adapter(config: AdapterConfig): Web3Adapter {
  const { rpcUrl, keystore } = config;
  const publicClient = createPublicClient({ transport: http(rpcUrl) });

  async function nextNonce(address: string): Promise<number> {
    return publicClient.getTransactionCount({ address: address as Address });
  }

  // Sign via the lightwallet keystore with the password scoped to this call,
  // then broadcast the raw signed tx. Mirrors the app's unlock->send->restore
  // flow, with passwordProvider swapped only for the signing duration.
  async function signAndSend(password: string, txParams: RawTxParams): Promise<Hex> {
    const original = keystore.passwordProvider;
    keystore.passwordProvider = (cb) => cb(null, password);
    try {
      const nonce = txParams.nonce ?? (await nextNonce(txParams.from));
      const signedTx: string = await new Promise((resolvePromise, rejectPromise) => {
        keystore.signTransaction(
          {
            from: txParams.from,
            to: txParams.to,
            value: toHexQuantity(txParams.value ?? 0n),
            gas: toHexQuantity(txParams.gas ?? 21000),
            gasPrice: toHexQuantity(txParams.gasPrice ?? 0n),
            nonce: toHexQuantity(nonce),
            ...(txParams.data ? { data: txParams.data } : {}),
          },
          (err, signed) => (err ? rejectPromise(err) : resolvePromise(signed)),
        );
      });
      const raw = (signedTx.startsWith('0x') ? signedTx : `0x${signedTx}`) as Hex;
      return publicClient.sendRawTransaction({ serializedTransaction: raw });
    } finally {
      keystore.passwordProvider = original;
    }
  }

  return {
    publicClient,

    async getBalance(address: string): Promise<bigint> {
      return publicClient.getBalance({ address: address as Address });
    },

    async getBlockNumber(): Promise<bigint> {
      return publicClient.getBlockNumber();
    },

    isAddress(address: string): boolean {
      return viemIsAddress(address);
    },

    async erc20BalanceOf(contract: string, address: string): Promise<bigint> {
      const result = await publicClient.readContract({
        address: contract as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      });
      return result as bigint;
    },

    async sendEth(params: SendEthParams): Promise<Hex> {
      return signAndSend(params.password, {
        from: params.from,
        to: params.to,
        value: params.valueWei,
        gas: params.gas,
        gasPrice: params.gasPriceWei,
      });
    },

    async erc20Transfer(params: Erc20TransferParams): Promise<Hex> {
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [params.to as Address, params.amount],
      });
      return signAndSend(params.password, {
        from: params.from,
        to: params.contract,
        value: 0n,
        gas: params.gas,
        gasPrice: params.gasPriceWei,
        data,
      });
    },
  };
}

export default createWeb3Adapter;
