import React from 'react';
import { Button } from 'reactstrap';
import { ethers } from "ethers";
import { SmartWalletUtils } from '@argent/smartwallet-utils';

import './App.css';

import Connect from './views/Connect';
import ExampleApp from './views/ExampleApp';

const infuraId = process.env.REACT_APP_INFURA_ID;

const CONFIGURATION = {
    1: {
        erc20: "0x6b175474e89094c44da98b954eedeac495271d0f",
        poolTogether: "0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958",
        tokenName: "DAI",
        tokenAmount: "10",
        etherscan: "https://etherscan.io"
    },
    3: {
        erc20: "0x583cbbb8a8443b38abcc0c956bece47340ea1367",
        poolTogether: "0x830CfFDd89746ac8b8F51c4aecd4e0a6e4A8a813",
        tokenName: "BOKKY",
        tokenAmount: "0.01",
        etherscan: "https://ropsten.etherscan.io"
    }
}

class App extends React.Component {

    state = {
        provider: null,
        walletHelper: null,
        address: null,
        ens: null,
        config: null,
        network: null
    }

    onConnected = async (web3Provider) => {
        const provider = new ethers.providers.Web3Provider(web3Provider);
        const address = await provider.getSigner(0).getAddress();
        const ens = await this.getENS(address, provider);
        const swu = new SmartWalletUtils(web3Provider, address);
        const walletHelper = await swu.getWalletHelper();
        const network = await provider.getNetwork();
        const config = CONFIGURATION[network.chainId];
        this.setState({ provider, walletHelper, address, ens, config, network });
    }

    getENS = async (address, provider) => {
        const name = await provider.lookupAddress(address);
        if (name === null) return null;

        const resolvedAddress = await provider.resolveName(name);
        if (address === resolvedAddress) return name;

        return null;
    }

    disconnect = async () => {
        localStorage.removeItem('walletconnect'); // to make sure WC is disconnected

        this.setState({ provider: null, wallet: null, address: null, ens: null, config: null, network: null });
    }

    render() {
        const {
            provider,
            walletHelper,
            address,
            ens,
            config,
            network
        } = this.state;

        return (
            <div className="App">
                <div className="App-content">
                    <h1>Argent Example Dapp</h1>
                    { provider === null ? (
                        <Connect infuraId={infuraId} onConnected={this.onConnected}/>
                    ) : (
                        <div>
                            <div>
                                <div>Wallet Address: {address}</div>
                                <div>Wallet ENS: {ens}</div>
                                <div>Wallet Type: {walletHelper.getName()}</div>
                                <div>Network: {network.name}</div>
                                <Button size="sm" onClick={this.disconnect}>Disconnect</Button>
                            </div>
                            <ExampleApp provider={provider} walletHelper={walletHelper} config={config} />
                        </div>
                    ) }
                </div>
            </div>
        );
    }
}

export default App;
