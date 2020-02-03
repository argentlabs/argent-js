import React from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, CustomInput, Alert } from 'reactstrap';

class Connect extends React.Component {

    state = {
        chainId: 3,
        error: null
    }

    handleSwitchChange = async (event) => {
        const chainId = event.target.checked ? 1 : 3;
        this.setState({ chainId });
    }

    onConnectWithWalletConnect = async () => {
        const {
            infuraId
        } = this.props;

        const {
            chainId
        } = this.state;

        this.setState({ error: null });

        const wcProvider = new WalletConnectProvider({ infuraId, chainId });

        try {
            await wcProvider.enable();
            this.props.onConnected(wcProvider);
        } catch (error) {
            this.onError(error);
        }
    }

    onConnectWithMetaMask = async () => {
        const {
            chainId
        } = this.state;

        this.setState({ error: null });

        if (typeof window.ethereum === 'undefined') {
            this.onError(new Error('MetaMask is not installed'));
            return;
        }

        const { ethereum } = window;
        if (ethereum.isMetaMask === false) {
            this.onError(new Error('MetaMask is not installed'));
            return;
        }

        if (parseInt(ethereum.networkVersion, 10) !== parseInt(chainId, 10)) {
            const networkName = (parseInt(chainId, 10) === 1) ? 'Main Ethereum Network' : 'Ropsten Test Network';
            this.onError(new Error(`Please update your MetaMask network to ${networkName}`));
            return;
        }

        await ethereum.enable();

        this.props.onConnected(ethereum);
    }

    onError = (error) => {
        this.setState({ error: error.message });
    }

    render() {
        const {
            chainId,
            error
        } = this.state;

        const checked = (chainId === 1);

        return (
            <div>
                <Button color="warning" onClick={this.onConnectWithMetaMask}>Connect With MetaMask</Button>{' '}
                <Button color="primary" onClick={this.onConnectWithWalletConnect}>Connect With Wallet Connect</Button>
                <CustomInput
                    type="switch"
                    name="networkSwitch"
                    id="networkSwitch"
                    label="Turn on for Mainnet, off for Ropsten"
                    checked={checked}
                    onChange={this.handleSwitchChange}
                />
                { error ? (
                    <Alert color="danger">{error}</Alert>
                ) : null}
            </div>
        );
    }
}

export default Connect;
