import React from 'react';
import { Button, Card, CardTitle, CardText } from 'reactstrap';

import { ethers } from 'ethers';
import { Contract } from 'ethers/contract';

import TxAlert from '../components/TxAlert';

const erc20ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)'
];
const poolTogetherABI = [
    'function depositPool(uint256 amount) public'
];

class ApproveThenCall extends React.Component {
    state = {
        enableApprove: true,
        enableCallContract: false,
        alert: null
    }

    componentDidMount = async () => {
        const {
            provider,
            config
        } = this.props;

        const signer = await provider.getSigner(0);

        this.erc20Contract = new Contract(config.erc20, erc20ABI, signer);
        this.poolTogetherContract = new Contract(config.poolTogether, poolTogetherABI, signer);
        this.numberOfTokens = ethers.utils.parseEther(config.tokenAmount);
    }

    onApprove = async () => {
        try {
            const tx = await this.erc20Contract.approve(this.poolTogetherContract.address, this.numberOfTokens);
            this.setState({
                enableApprove: false,
                alert: {
                    color: 'info',
                    text: `Transaction ${tx.hash} is pending...`
                }
            });
            const receipt = await tx.wait();

            this.setState({
                enableCallContract: true,
                alert: {
                    color: 'success',
                    text: `Transaction ${tx.hash} is mined!`
                }
            });
        } catch (error) {
            this.setState({
                enableApprove: false,
                enableCallContract: false,
                alert: {
                    color: 'danger',
                    text: error.message
                }
            });
        }
    }

    onCallContract = async () => {
        try {
            const tx = await this.poolTogetherContract.depositPool(this.numberOfTokens, { gasLimit: 100000 });
            this.setState({
                enableCallContract: false,
                alert: {
                    color: 'info',
                    text: `Transaction ${tx.hash} is pending...`
                }
            });
            await tx.wait();
            this.setState({
                alert: {
                    color: 'success',
                    text: `Transaction ${tx.hash} is mined!`
                }
            });
        } catch (error) {
            this.setState({
                enableApprove: false,
                enableCallContract: false,
                alert: {
                    color: 'danger',
                    text: error.message
                }
            });
        }
    }

    render() {
        const {
            config
        } = this.props;

        const {
            enableApprove,
            enableCallContract,
            alert
        } = this.state;

        return (
            <React.Fragment>
                <Card body inverse color="info">
                    <CardTitle>Approve ERC20 and Call contract</CardTitle>
                    <CardText>
                        Step 1: Approve {config.tokenAmount} {config.tokenName} on<br/>
                        <code>{config.erc20}</code>
                    </CardText>
                    <Button onClick={this.onApprove} disabled={!enableApprove} color="secondary">Approve</Button>
                    <CardText>
                        Step 2: Call <code>depositPool(uint amount)</code> on<br/>
                        <code>{config.poolTogether}</code>
                    </CardText>
                    <Button onClick={this.onCallContract} disabled={!enableCallContract} color="secondary">Call Contract</Button>
                    { alert ? (
                        <TxAlert color={alert.color} text={alert.text} etherscanUrl={config.etherscan} />
                    ) : null }
                </Card>
            </React.Fragment>
        );
    }
}

export default ApproveThenCall;
