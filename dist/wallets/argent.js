"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const ethers_1 = require("ethers");
const contract_1 = require("ethers/contract");
const argentABI = [
    'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)',
    'function approveTokenAndCallContract(address _wallet, address _token, address _contract, uint256 _amount, bytes _data) external'
];
class Argent {
    constructor(address, provider) {
        this.type = interfaces_1.WalletType.Argent;
        this.provider = provider;
        this.supportEIP1271 = true;
        this.supportApproveAndCall = true;
        if (!ethers_1.utils.getAddress(address)) {
            throw new Error('Invalid signer address');
        }
        this.address = address;
    }
    getName() {
        return 'Argent';
    }
    getWalletContract() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.contract)
                return this.contract;
            const signer = yield this.provider.getSigner(0);
            this.contract = new contract_1.Contract(this.address, argentABI, signer);
            return this.contract;
        });
    }
    isWallet(codeSignature) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            if (codeSignature === '0x83baa4b2') {
                const impl = yield this.provider.getStorageAt(this.address, 0);
                success = ['0xb1dd690cc9af7bb1a906a9b5a94f94191cc553ce'].includes(ethers_1.utils.hexDataSlice(impl, 12));
            }
            return Promise.resolve(success);
        });
    }
    isValidSignature(message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexArray = ethers_1.utils.arrayify(message);
            const hashMessage = ethers_1.utils.hashMessage(hexArray);
            try {
                const walletContract = yield this.getWalletContract();
                const returnValue = yield walletContract.isValidSignature(hashMessage, signature);
                return Promise.resolve(returnValue);
            }
            catch (err) {
                return Promise.resolve(false);
            }
        });
    }
    approveAndCall(token, amount, contract, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletContract = yield this.getWalletContract();
            const tx = yield walletContract.approveTokenAndCallContract(this.address, token, contract, amount, data);
            return Promise.resolve(tx.hash);
        });
    }
}
exports.Argent = Argent;
//# sourceMappingURL=argent.js.map