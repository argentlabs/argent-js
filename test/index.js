const { SmartWalletUtils } = require('../dist/index');
const Web3 = require('web3');


(async () => {
    const web3Provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');
    const eoaAddress = '0x65d8fbcdeb9ef8b9251394d92cc513610cc2effb'
    const argentAddress = '0x8daEd1C8233547aD869fce7A80cd5bd6E89b4826'
    const address = argentAddress
    const swu = new SmartWalletUtils(web3Provider, address);
    const wallet = await swu.getWallet();
    console.log(wallet);
})().catch(err => {
    console.log(err);
});
