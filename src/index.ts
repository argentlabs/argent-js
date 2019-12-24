import { ethers } from 'ethers'
import { Wallet } from './interfaces'
import { EOA } from './wallets/eoa'
import { Argent } from './wallets/argent'
import { AsyncSendable, Web3Provider } from 'ethers/providers/web3-provider'

export class SmartWalletUtils {

    provider: ethers.providers.Provider
    wallets: Array<Wallet>
    address: string

    constructor(web3Provider: AsyncSendable, address: string) {
      
        this.provider = new Web3Provider(web3Provider)
        if (!ethers.utils.getAddress(address)) {
            throw new Error('Invalid address')
        }
        this.address = address
        this.wallets = [
            new EOA(this.address), 
            new Argent(this.address, this.provider)
        ]
    }

    async getWallet(): Promise<Wallet> {

        let wallet: Wallet

        const code = await this.provider.getCode(this.address)
        const codeSignature = ethers.utils.keccak256(code).slice(0, 10)
        for (let index in this.wallets) {
            wallet = this.wallets[index]
            const isWallet = await wallet.isWallet(codeSignature)
            if (isWallet) break;
        }
        if(!wallet) {
            throw new Error('Unknown wallet type')
        }
        return wallet
    }

}