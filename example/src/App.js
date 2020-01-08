import React from 'react';
import { Button } from 'reactstrap';
import { ethers } from "ethers";
import { SmartWalletUtils } from 'smartwallet-utils';

import './App.css';

import Connect from './views/Connect';
import ExampleApp from './views/ExampleApp';

const infuraId = process.env.REACT_APP_INFURA_ID;
const chainId = process.env.REACT_APP_CHAIN_ID;

class App extends React.Component {

    state = {
        provider: null,
        wallet: null,
        displayedAddress: null
    }

    async componentDidMount() {

    }

    onConnected = async (web3Provider) => {
        const provider = new ethers.providers.Web3Provider(web3Provider);
        const address = await provider.getSigner(0).getAddress();
        const displayedAddress = await this.displayedAddress(address, provider);
        const swu = new SmartWalletUtils(web3Provider, address);
        const wallet = await swu.getWallet();
        this.setState({ provider, wallet, displayedAddress });
    }

    displayedAddress = async (address, provider) => {
        const name = await provider.lookupAddress(address);
        if (name === null) return address;

        const resolvedAddress = await provider.resolveName(name);
        if (address === resolvedAddress) return name;

        return address;
    }

    disconnect = async () => {
        localStorage.removeItem('walletconnect'); // to make sure WC is disconnected

        this.setState({ provider: null, wallet: null, displayedAddress: null });
    }

    onError = async (error) => {
        console.log(error);
    }

    render() {
        const {
            provider,
            wallet,
            displayedAddress
        } = this.state;

        return (
            <div className="App">
                <div className="App-content">
                    <h1>SmartWallet Utils Example Dapp</h1>
                    { provider === null ? (
                        <Connect infuraId={infuraId} chainId={chainId} onConnected={this.onConnected} onError={this.onError}/>
                    ) : (
                        <div>
                            <div>
                                <div>Hello {displayedAddress}</div>
                                <Button size="sm" onClick={this.disconnect}>Disconnect</Button>
                            </div>
                            <ExampleApp provider={provider} wallet={wallet} />
                        </div>
                    ) }
                </div>
            </div>
        );
    }
}

export default App;
