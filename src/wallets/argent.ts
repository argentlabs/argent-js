import { Wallet, WalletType } from '../interfaces'
import { utils } from 'ethers';
import { Provider } from 'ethers/providers'
import { Contract } from 'ethers/contract'

const argentABI = [
    'function isValidSignature(bytes _message, bytes _signature) public returns (bool)',
    'function approveTokenAndCallContract(address _wallet, address _token, address _contract, uint256 _amount, bytes _data) external'
];

export class Argent implements Wallet {

    contract: Contract
    type: WalletType
    address: string
    supportEIP1271: boolean
    supportApproveAndCall: boolean

    constructor(address: string, provider: Provider) {
        this.type = WalletType.Argent
        this.contract = new Contract(address, argentABI, provider)
        this.supportEIP1271 = true
        this.supportApproveAndCall = true
        if (!utils.getAddress(address)) {
            throw new Error('Invalid signer address')
        }
        this.address = address
    }

    async isWallet(codeSignature: string): Promise<boolean> {
        let success = false
        if (codeSignature === '0x83baa4b2') {
            const impl = await this.contract.provider.getStorageAt(this.address, 0);
            success = ['0xb1dd690cc9af7bb1a906a9b5a94f94191cc553ce'].includes(utils.hexDataSlice(impl, 12))
        }
        return Promise.resolve(success)
    }
    
    async isValidSignature(message: string, signature: string): Promise<boolean> {
        const returnValue = await this.contract.isValidSignature(message, signature)
        return Promise.resolve(returnValue)
    }

    async approveAndCall(token: string, amount: number, contract: string, data: string): Promise<string> {
        const tx = await this.contract.approveTokenAndCallContract(this.address, token, contract, amount, data)
        return Promise.resolve(tx.hash)
    }
}