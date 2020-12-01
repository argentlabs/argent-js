import { Wallet, WalletType } from '../interfaces'
import { ethers, utils } from 'ethers'

const argentABI = [
  'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)',
  'function approveTokenAndCallContract(address _wallet, address _token, address spender, uint256 _amount, address _contract, bytes _data) external'
];

const detectorABI = [
  'function isArgentWallet(address _wallet) external view returns (bool)'
];

const DEFAULT_GAS_APPROVECALL = 500000
const WALLET_DETECTOR_ADDRESS = {
    1: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
    3: '0xB5F49f8899D61b89DC8093e646F327d4E10e1277'
}

export class Argent implements Wallet {

    provider: ethers.providers.Web3Provider
    contract: ethers.Contract
    type: WalletType
    address: string
    supportEIP1271: boolean
    supportApproveAndCall: boolean

    constructor(address: string, provider: ethers.providers.Web3Provider) {
        this.type = WalletType.Argent
        this.provider = provider;
        this.supportEIP1271 = true
        this.supportApproveAndCall = true
        if (!utils.getAddress(address)) {
            throw new Error('Invalid signer address')
        }
        this.address = address
    }

    getName(): string {
        return 'Argent'
    }

    async getWalletContract(): Promise<ethers.Contract> {
        if (this.contract) return this.contract

        const signer = await this.provider.getSigner(0)
        this.contract = new ethers.Contract(this.address, argentABI, signer)
        return this.contract
    }

    async isWallet(codeHash: string): Promise<boolean> {
        const network = await this.provider.getNetwork()
        if (WALLET_DETECTOR_ADDRESS.hasOwnProperty(network.chainId) === false) return Promise.resolve(false)

        const detector = new ethers.Contract(WALLET_DETECTOR_ADDRESS[network.chainId], detectorABI, this.provider)
        const result = await detector.isArgentWallet(this.address)

        return Promise.resolve(result);
    }

    async isValidSignature(message: string, signature: string): Promise<boolean> {
        const hexArray = utils.arrayify(message)
        const hashMessage = utils.hashMessage(hexArray)
        try {
            const walletContract = await this.getWalletContract()
            const returnValue = await walletContract.isValidSignature(hashMessage, signature)
            return Promise.resolve(returnValue)
        } catch (err) {
            return Promise.resolve(false)
        }
    }

    async approveAndCall(token: string, amount: number, spender: string, contract: string, data: string, gasLimit: number = 0): Promise<string> {
        let gas = gasLimit
        if (gas === 0) {
            try {
                gas = await this.estimateGasApproveAndCall(token, amount, contract, data)
            } catch (error) {
                gas = DEFAULT_GAS_APPROVECALL
            }
        }

        const walletContract = await this.getWalletContract()
        const tx = await walletContract.approveTokenAndCallContract(
          this.address,
          token,
          spender,
          amount,
          contract,
          data,
          { gasLimit: gas }
        );
        return Promise.resolve(tx.hash)
    }

    async estimateGasApproveAndCall(token: string, amount: number, contract: string, data: string) {
        const erc20Interface = new utils.Interface(['function approve(address spender, uint256 amount) external returns (bool)'])
        const erc20Data = erc20Interface.encodeFunctionData('approve', [contract, amount])
        const erc20Gas = await this.provider.estimateGas({ from: this.address, to: token, data: erc20Data })
        const callContractGas = await this.provider.estimateGas({ from: this.address, to: contract, data })
        return erc20Gas.toNumber() + callContractGas.toNumber()
    }
}
