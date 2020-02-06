import React from 'react';
import { Alert } from 'reactstrap';

class TxAlert extends React.Component {
    render() {
        const {
            color,
            text,
            etherscanUrl
        } = this.props;

        const index = text.search(/0x([A-Fa-f0-9]{64})/);
        if (index === -1) return (
            <Alert color={color}>{text}</Alert>
        );

        const left = text.slice(0, index);
        const txHash = text.slice(index, index + 66);
        const right = text.slice(index + 66);

        return (
            <Alert color={color}>
                { left }
                <a href={`${etherscanUrl}/tx/${txHash}`} target='_blank' rel="noopener noreferrer">
                    { txHash.slice(0, 6) }...{ txHash.slice(-4) }
                </a>
                { right }
            </Alert>
        )
    }
}

export default TxAlert;
