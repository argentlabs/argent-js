import { SmartWalletUtils } from '../src/index';
import { WalletType } from '../src/interfaces';

import Web3 from 'web3';

import { expect } from 'chai';
import 'mocha';

const web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73');

describe('EOA test', () => {
    it('wallet type should be EOA', async () => {
        const swu = new SmartWalletUtils(web3Provider, '0x65d8fbcdeb9ef8b9251394d92cc513610cc2effb');
        const walletHelper = await swu.getWalletHelper();
        const result = walletHelper.type;
        expect(result).to.equal(WalletType.EOA);
    });
});

describe('Argent Wallet test', () => {
    let walletHelper;

    before(async () => {
        const swu = new SmartWalletUtils(web3Provider, '0x703308521617DFBb236860Ab07eBa9d2eF990746');
        walletHelper = await swu.getWalletHelper();
    });

    it('wallet type should be Argent', async () => {
        const result = walletHelper.type;
        expect(result).to.equal(WalletType.Argent);
    });

    // it('signature should be valid', async () => {
    //     const result = await walletHelper.isValidSignature('0x636f6769746f206572676f2073756d', '0x9d3accbead0c7212e6971abf755ef3fd7c57c12fecc3db33e02a47be15b0a3db03beb0e3915062f7c92f726f3b280cfeb3204d86dc2dd37a0804e355af100a5b1b');
    //     expect(result).to.equal(true);
    // });
});