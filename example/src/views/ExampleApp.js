import React from 'react';
import { Button } from 'reactstrap';

import { ethers } from 'ethers';
import { Contract } from 'ethers/contract'

const erc20ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)'
];
const poolTogetherABI = [
    'function depositPool(uint256 amount) public'
];

class ExampleApp extends React.Component {
    state = {
        response: []
    }

    // async componentDidMount() {
    //     const {
    //         provider
    //     } = this.props;

    //     const address = await provider.getSigner(0).getAddress();
    //     this.setState({ address });
    // }

    onSign = async () => {
        const {
            provider,
            wallet
        } = this.props;

        this.resetResponse();

        const message = 'cogito ergo sum';
        const arrayishMessage = ethers.utils.toUtf8Bytes(message);
        const hexMessage = ethers.utils.hexlify(arrayishMessage);

        const address = await provider.getSigner(0).getAddress();
        const signature = await provider.send('personal_sign', [hexMessage, address]);

        const isValid = await wallet.isValidSignature(hexMessage, signature);

        const response = [
            `message: ${message}`,
            `hexMessage: ${hexMessage}`,
            `signHash: ${ethers.utils.hashMessage(arrayishMessage)}`,
            `signature: ${signature}`,
            `isValid: ${ isValid ? 'true' : 'false' }`
        ]

        this.setState({ response });
    }

    onApproveAndCall = async () => {
        const {
            provider,
            wallet
        } = this.props;

        this.resetResponse();

        const signer = await provider.getSigner(0);

        const daiContract = new Contract(process.env.REACT_APP_DAI, erc20ABI, signer);
        const poolTogetherContract = new Contract(process.env.REACT_APP_POOL_TOGETHER, poolTogetherABI, signer);

        const address = await provider.getSigner(0).getAddress();
        const numberOfTokens = ethers.utils.parseEther('0.05'); // 1 DAI
        if (wallet.supportApproveAndCall === false) {
            console.log('approve and call not supported');
            const tx1 = await daiContract.approve(address, numberOfTokens);
            console.log(tx1.hash);
            await tx1.wait();
            console.log('tx1 mined');
            // const tx2 = await poolTogetherContract.depositPool(numberOfTokens);
            // console.log(tx2.hash);
            // await tx2.wait();
        } else {
            console.log('support approve and call');
        }
    }

    resetResponse = () => {
        this.setState({ response: [] });
    }

    render() {
        const {
            response
        } = this.state;

        return (
            <div>
                <h2>Actions:</h2>
                <div>
                    <Button color="primary" onClick={this.onSign}>Sign Message</Button>{' '}
                    <Button color="success" onClick={this.onApproveAndCall}>Approve And Call</Button>
                </div>
                <div>
                    { response.map((item, idx) => (
                        <div key={idx}>{item}</div>
                    )) }
                </div>
            </div>
        );
    }
}

export default ExampleApp;
