"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const ethers_1 = require("ethers");
class EOA {
    constructor(address) {
        this.type = interfaces_1.WalletType.EOA;
        this.supportEIP1271 = false;
        this.supportApproveAndCall = false;
        if (!ethers_1.ethers.utils.getAddress(address)) {
            throw new Error('Invalid signer address');
        }
        this.address = address.toLowerCase();
    }
    isWallet(codeSignature) {
        return Promise.resolve(codeSignature === '0xc5d24601');
    }
    isValidSignature(message, signature) {
        const msgSigner = ethers_1.ethers.utils.verifyMessage(message, signature);
        return Promise.resolve(msgSigner.toLowerCase() === this.address);
    }
    approveAndCall(token, amount, contract, data) {
        return Promise.reject(new Error('EOA does not support approveAndCall'));
    }
}
exports.EOA = EOA;
//# sourceMappingURL=eoa.js.map