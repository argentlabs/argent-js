import React from 'react';
import { Button, Card, CardTitle, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { ethers } from 'ethers';

class SignMessage extends React.Component {
    state = {
        response: []
    }

    onSign = async (method) => {
        const {
            provider,
            walletHelper
        } = this.props;

        this.resetResponse();

        const message = 'cogito ergo sum';
        const arrayishMessage = ethers.utils.toUtf8Bytes(message);
        const hexMessage = ethers.utils.hexlify(arrayishMessage);

        const signer = provider.getSigner(0);
        const address = await signer.getAddress();

        let signature;
        if (method === 'personal_sign') {
            signature = await provider.send('personal_sign', [hexMessage, address]);
        } else if (method === 'eth_sign') {
            signature = await signer.signMessage(arrayishMessage);
        }

        const isValid = await walletHelper.isValidSignature(hexMessage, signature);

        const response = [
            `message: ${message}`,
            `hexMessage: ${hexMessage}`,
            `signHash: ${ethers.utils.hashMessage(arrayishMessage)}`,
            `signature: ${signature}`,
            `isValid: ${ isValid ? 'true' : 'false' }`
        ]

        this.setState({ response });
    }

    resetResponse = () => {
        this.setState({ response: [] });
    }

    toggle = () => {
        this.resetResponse();
    }

    render() {
        const {
            response
        } = this.state;

        const isOpen = response.length > 0;

        return (
            <React.Fragment>
                <Modal isOpen={isOpen} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Sign and Verify Result</ModalHeader>
                    <ModalBody>
                        <pre>
                            { response.map((item, idx) => (
                                <div key={idx}>{item}</div>
                            )) }
                        </pre>
                    </ModalBody>
                </Modal>
                <Card body inverse color="primary">
                    <CardTitle>Sign and Verify Message</CardTitle>
                    <CardText>Ask the wallet to sign the message <code>"cogito ergo sum"</code> using the method <code>personal_sign</code> and verify the signature (<code>ecrecover</code> for EOA, EIP-1271 for smart contract based wallets)</CardText>
                    <Button onClick={() => this.onSign('personal_sign')} color="secondary">Sign with personal_sign</Button>
                    <Button onClick={() => this.onSign('eth_sign')} color="secondary">Sign with eth_sign</Button>
                </Card>
            </React.Fragment>
        );
    }
}

export default SignMessage;
