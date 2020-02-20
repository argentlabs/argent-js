import { ethers } from 'ethers'

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
    isWallet: (codeSignature: string) => Promise<boolean>
    isValidSignature: (message: string, signature: string) => Promise<boolean>
    approveAndCall: (token: string, amount: number, contract: string, data: string, gasLimit: number) => Promise<string>
}