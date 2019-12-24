import React from 'react';
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from 'reactstrap';
import './App.css';

class App extends React.Component {

    async componentDidMount() {
        //  Create WalletConnect Provider
        this.web3Provider = new WalletConnectProvider({
            infuraId: "40ce078f51f048d6a099a321ae96be63" // Required
        });
    }

    onConnect = async () => {
        //  Enable session (triggers QR Code modal)
        await this.web3Provider.enable();
        //  Create Web3
        this.provider = new ethers.providers.Web3Provider(this.web3Provider);
    }

    onSign = async () => {
        let address = await this.provider.getSigner(0).getAddress();
        let signature = await this.provider.send('personal_sign', ['0x1234', address]);
        console.log(signature);
    }

    render() {
        return (
            <div className="App">
            <header className="App-header">
                <Button onClick={this.onConnect}>Connect</Button>
                <Button onClick={this.onSign}>Sign</Button>
            </header>
            </div>
        );
    }
}

export default App;
