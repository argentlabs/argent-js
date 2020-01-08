const { SmartWalletUtils } = require('../dist/index');
const Web3 = require('web3');
const ethers = require('ethers');


(async () => {
    const web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io');
    const eoaAddress = '0x65d8fbcdeb9ef8b9251394d92cc513610cc2effb'
    const argentAddress = '0x44065cf7b85694B5A56CDACCC711dE57fB83Bff7' // '0x65d12384761bFE6cdaCF1169c3b7333B6eab42B2'
    const address = argentAddress
    const swu = new SmartWalletUtils(web3Provider, address);
    const wallet = await swu.getWallet();
    // console.log(wallet);
    const isValid = await wallet.isValidSignature('0x636f6769746f206572676f2073756d', '0x32adfd1312e0ed8701a2f667958a85878b3d4cea61714337f4b360d283f7d3113f4a30c7bb6a3bda24dfa2f1c107f8f24b7d0f9b7d334a00f802f190f73f32451b');
    console.log(isValid);
})().catch(err => {
    console.log(err);
});
