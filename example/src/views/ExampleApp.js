import React from 'react';
import { Button } from 'reactstrap';
import { ethers } from 'ethers';


class ExampleApp extends React.Component {
    state = {
        adress: null
    }

    async componentDidMount() {
        const {
            provider
        } = this.props;

        const address = await provider.getSigner(0).getAddress();
        this.setState({ address });
    }

    onSign = async () => {
        const {
            provider,
            wallet
        } = this.props;

        const message = 'cogito ergo sum';
        const arrayishMessage = ethers.utils.toUtf8Bytes(message);
        const hexMessage = ethers.utils.hexlify(arrayishMessage);

        const address = await provider.getSigner(0).getAddress();
        const signature = await provider.send('personal_sign', [hexMessage, address]);

        const isValid = await wallet.isValidSignature(hexMessage, signature);

        console.log(isValid);
    }

    render() {
        const {
            address
        } = this.state;

        return (
            <div>
                <div>{ address ? address : null}</div>
                <Button onClick={this.onSign}>Sign</Button>
                <Button onClick={this.props.disconnect}>Disconnect</Button>
            </div>
        );
    }
}

export default ExampleApp;
