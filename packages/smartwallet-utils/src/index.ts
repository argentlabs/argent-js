import { ethers } from 'ethers'
import { Wallet, Web3Provider } from './interfaces';
import { EOA } from './wallets/eoa'
import { Argent } from './wallets/argent'

export class SmartWalletUtils {

    provider: Web3Provider
    wallets: Array<Wallet>
    address: string

    constructor(ethereum: ethers.providers.ExternalProvider | Web3Provider, address: string) {

        this.provider = ethers.providers.Provider.isProvider(ethereum) ?
          ethereum : new ethers.providers.Web3Provider(ethereum)
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
        const codeHash = ethers.utils.keccak256(code)
        for (const wallet of this.wallets) {
            const isWallet = await wallet.isWallet(codeHash)
            if (isWallet === true) return wallet
        }
        return this.wallets[0]
    }
}
