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

class ApproveAndCall extends React.Component {
    state = {
        enableApproveAndCall: true,
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

    onApproveAndCall = async () => {
        const {
            provider,
            walletHelper
        } = this.props;

        try {
            const data = this.poolTogetherContract.interface.functions.depositPool.encode([ this.numberOfTokens ]);
            const txHash = await walletHelper.approveAndCall(this.erc20Contract.address, this.numberOfTokens, this.poolTogetherContract.address, data);
            this.setState({
                enableApproveAndCall: false,
                alert: {
                    color: 'info',
                    text: `Transaction ${txHash} is pending...`
                }
            });

            const receipt = await provider.waitForTransaction(txHash);
            console.log(receipt);
            this.setState({
                enableApproveAndCall: false,
                alert: {
                    color: 'info',
                    text: `Transaction ${txHash} is mined`
                }
            });

        } catch (error) {
            this.setState({
                enableApproveAndCall: false,
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
            enableApproveAndCall,
            alert
        } = this.state;

        return (
            <React.Fragment>
                <Card body inverse color="info">
                    <CardTitle>Approve ERC20 and Call contract</CardTitle>
                    <CardText>
                        Approve {config.tokenAmount} {config.tokenName} on<br/>
                        <code>{config.erc20}</code><br/>
                        and call <code>depositPool(uint amount)</code> on<br/>
                        <code>{config.poolTogether}</code>
                    </CardText>
                    <Button onClick={this.onApproveAndCall} disabled={!enableApproveAndCall} color="secondary">Approve and Call</Button>
                    { alert ? (
                        <TxAlert color={alert.color} text={alert.text} etherscanUrl={config.etherscan} />
                    ) : null }
                </Card>
            </React.Fragment>
        );
    }
}

export default ApproveAndCall;
