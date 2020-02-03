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
const ethers_1 = require("ethers");
const eoa_1 = require("./wallets/eoa");
const argent_1 = require("./wallets/argent");
const web3_provider_1 = require("ethers/providers/web3-provider");
class SmartWalletUtils {
    constructor(ethereum, address) {
        this.provider = new web3_provider_1.Web3Provider(ethereum);
        if (!ethers_1.ethers.utils.getAddress(address)) {
            throw new Error('Invalid address');
        }
        this.address = address;
        this.wallets = [
            new eoa_1.EOA(this.address),
            new argent_1.Argent(this.address, this.provider)
        ];
    }
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            let wallet;
            const code = yield this.provider.getCode(this.address);
            const codeSignature = ethers_1.ethers.utils.keccak256(code).slice(0, 10);
            for (let index in this.wallets) {
                wallet = this.wallets[index];
                const isWallet = yield wallet.isWallet(codeSignature);
                if (isWallet)
                    break;
            }
            if (!wallet) {
                throw new Error('Unknown wallet type');
            }
            return wallet;
        });
    }
}
exports.SmartWalletUtils = SmartWalletUtils;
//# sourceMappingURL=index.js.map