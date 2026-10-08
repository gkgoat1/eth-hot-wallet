export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

/* Auto generated password length */
export const generatedPasswordLength = 12;

/* Default HD path string for key generation from seed */
export const hdPathString = `m/44'/60'/0'/0`;

// time in ms for check balances polling
export const timeBetweenCheckbalances = 180 * 1000;

/* Max gas for send transaction (not gas price) */
export const maxGasForEthSend = 25000;
/* Max gas for token send transaction (not gas price) */
export const maxGasForTokenSend = 60000;

/* Eth unit constants saved as strings to prevent accidental manipulation.
    usage: const sendAmount = new BigNumber(amount).times(Ether);
*/
export const Ether = (1.0e18).toString();
export const Gwei = (1.0e9).toString();

/* offline mode is special case of error */
export const offlineModeString = 'Offline';
/* Default network to connect after wallet creation (see network.js) */
export const defaultNetwork = 'Ropsten Testnet';

/* keystore saved to local storage under this key */
export const localStorageKey = 'ks';

// addresses:
export const website = 'https://eth-hot-wallet.com';
export const github = 'https://github.com/PaulLaux/eth-hot-wallet';

// APIs:
export const checkFaucetAddress =
  'https://m6b19m0fxh.execute-api.eu-west-1.amazonaws.com/dev/status';
export const askFaucetAddress =
  'https://m6b19m0fxh.execute-api.eu-west-1.amazonaws.com/dev/ask';
