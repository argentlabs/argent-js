# smart-wallet-utils

## Installation

```bash
npm install @argent/smart-wallet-utils
```

## Usage

Create an instance of `SmartWalletUtils`

```js
const swu = new SmartWalletUtils(web3Provider, address);
const walletHelper = await swu.getWalletHelper();
```

Check if a message signature is valid

```js
const isValid = await walletHelper.isValidSignature(hexMessage, signature);
```

Trigger an Approve ERC20 tokens and call contract in one single transaction, if supported by the wallet

```js
if (walletHelper.supportApproveAndCall) {
    const txHash = await walletHelper.approveAndCall(erc20Contract, amount, contract, data);
}
```

## License

Released under [LGPL-3.0](LICENSE)
