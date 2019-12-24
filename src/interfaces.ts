import { Contract } from 'ethers/contract'

export enum WalletType {
    EOA,
    Argent
}

export interface Wallet {
    type: WalletType
    address: string
    contract?: Contract
    supportEIP1271: boolean
    supportApproveAndCall: boolean
    isWallet: (codeSignature: string) => Promise<boolean>
    isValidSignature: (message: string, signature: string) => Promise<boolean>
    approveAndCall: (token: string, amount: number, contract: string, data: string) => Promise<string> 
}