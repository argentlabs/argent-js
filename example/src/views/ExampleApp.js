import React from 'react';
import { Button } from 'reactstrap';
import { ethers } from 'ethers';


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
