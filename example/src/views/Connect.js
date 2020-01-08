import React from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from 'reactstrap';

class Connect extends React.Component {

    onConnectWithWalletConnect = async () => {
        const {
            infuraId,
            chainId
        } = this.props;

        const wcProvider = new WalletConnectProvider({ infuraId, chainId });

        try {
            await wcProvider.enable();
            this.props.onConnected(wcProvider);
        } catch (error) {
            this.props.onError(error);
        }
    }

    onConnectWithMetaMask = async () => {
        const {
            chainId
        } = this.props;

        if (typeof window.ethereum === 'undefined') {
            this.props.onError(new Error('MetaMask is not installed'));
            return;
        }

        const { ethereum } = window;
        if (ethereum.isMetaMask === false) {
            this.props.onError(new Error('MetaMask is not installed'));
            return;
        }

        if (parseInt(ethereum.networkVersion, 10) !== parseInt(chainId, 10)) {
            this.props.onError(new Error(`MetaMask: Wrong network version, should be ${chainId}`));
            return;
        }

        await ethereum.enable();

        this.props.onConnected(ethereum);
    }

    render() {
        return (
            <div>
                <Button color="warning" onClick={this.onConnectWithMetaMask}>Connect With MetaMask</Button>{' '}
                <Button color="primary" onClick={this.onConnectWithWalletConnect}>Connect With Wallet Connect</Button>
            </div>
        );
    }
}

export default Connect;
