import { ethers } from 'ethers'
import { Wallet } from './interfaces'
import { EOA } from './wallets/eoa'
import { Argent } from './wallets/argent'

export class SmartWalletUtils {

    provider: ethers.providers.Web3Provider
    wallets: Array<Wallet>
    address: string

    constructor(ethereum: ethers.providers.ExternalProvider, address: string) {

        this.provider = new ethers.providers.Web3Provider(ethereum)
        if (!ethers.utils.getAddress(address)) {
            throw new Error('Invalid address')
        }
        this.address = address
        this.wallets = [
            new EOA(this.address),
            new Argent(this.address, this.provider)
        ]
    }

    async getWalletHelper(): Promise<Wallet> {
        const code = await this.provider.getCode(this.address)
        for (const wallet of this.wallets) {
            const isWallet = await wallet.isWallet(code)
            if (isWallet === true) return wallet
        }
        return this.wallets[0]
    }
}