import { Wallet, WalletType } from '../interfaces'
import { ethers } from 'ethers';

export class EOA implements Wallet {

    type: WalletType
    address: string
    supportEIP1271: boolean
    supportApproveAndCall: boolean

    constructor(address: string) {
        this.type = WalletType.EOA
        this.supportEIP1271 = false
        this.supportApproveAndCall = false
        if (!ethers.utils.getAddress(address)) {
            throw new Error('Invalid signer address')
        }
        this.address = address.toLowerCase()
    }

    isWallet(codeSignature: string): Promise<boolean> {
        return Promise.resolve(codeSignature === '0xc5d24601')
    }

    isValidSignature(message: string, signature: string): Promise<boolean> {
        const hexArray = ethers.utils.arrayify(message)
        const msgSigner = ethers.utils.verifyMessage(hexArray, signature)
        return Promise.resolve(msgSigner.toLowerCase() === this.address)
    }

    approveAndCall(token: string, amount: number, contract: string, data: string): Promise<string> {
        return Promise.reject(new Error('EOA does not support approveAndCall'))
    }
}