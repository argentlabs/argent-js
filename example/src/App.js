import React from 'react';
import { ethers } from "ethers";
import { SmartWalletUtils } from "smartwallet-utils";

import './App.css';

import Connect from './views/Connect';
import ExampleApp from './views/ExampleApp';

const infuraId = process.env.REACT_APP_INFURA_ID;
const chainId = process.env.REACT_APP_CHAIN_ID;

class App extends React.Component {

    state = {
        provider: null,
        wallet: null
    }

    async componentDidMount() {

    }

    onConnected = async (web3Provider) => {
        const provider = new ethers.providers.Web3Provider(web3Provider);
        const address = await provider.getSigner(0).getAddress();
        const swu = new SmartWalletUtils(web3Provider, address);
        const wallet = await swu.getWallet();
        this.setState({ provider, wallet });
    }

    disconnect = async () => {
        localStorage.removeItem('walletconnect'); // to make sure WC is disconnected

        this.setState({ provider: null, wallet: null });
    }

    onError = async (error) => {
        console.log(error);
    }

    render() {
        const {
            provider,
            wallet
        } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    SmartWallet Utils Example Dapp
                    { provider === null ? (
                        <Connect infuraId={infuraId} chainId={chainId} onConnected={this.onConnected} onError={this.onError}/>
                    ) : (
                        <ExampleApp provider={provider} wallet={wallet} disconnect={this.disconnect} />
                    ) }

                </header>
            </div>
        );
    }
}

export default App;
