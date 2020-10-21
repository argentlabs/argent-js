import { Wallet, WalletType } from '../interfaces'
import { ethers } from 'ethers';

const EOA_CODEHASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

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

    getName(): string {
        return 'EOA'
    }

    isWallet(codeHash: string): Promise<boolean> {
        return Promise.resolve(codeHash === EOA_CODEHASH)
    }

    isValidSignature(message: string, signature: string): Promise<boolean> {
        const hexArray = ethers.utils.arrayify(message)
        const msgSigner = ethers.utils.verifyMessage(hexArray, signature)
        return Promise.resolve(msgSigner.toLowerCase() === this.address)
    }

    approveAndCall(token: string, amount: number, spender: string, contract: string, data: string, gasLimit: number): Promise<string> {
        return Promise.reject(new Error('EOA does not support approveAndCall'))
    }
}