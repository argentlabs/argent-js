import { ethers } from 'ethers'

export type Web3Provider = ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider

export enum WalletType {
    EOA,
    Argent
}

export interface Wallet {
    type: WalletType
    address: string
    contract?: ethers.Contract
    supportEIP1271: boolean
    supportApproveAndCall: boolean
    getName: () => string
    isWallet: (codeHash: string) => Promise<boolean>
    isValidSignature: (message: string, signature: string) => Promise<boolean>
    approveAndCall: (token: string, amount: number, spender: string, contract: string, data: string, gasLimit: number) => Promise<string>
}
