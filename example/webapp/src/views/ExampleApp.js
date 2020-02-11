import React from 'react';

import SignMessage from './actions/SignMessage';
import ApproveAndCall from './actions/ApproveAndCall';
import ApproveThenCall from './actions/ApproveThenCall';

class ExampleApp extends React.Component {
    render() {
        const {
            provider,
            walletHelper,
            config
        } = this.props;

        return (
            <React.Fragment>
                <SignMessage provider={provider} walletHelper={walletHelper} />
                { (walletHelper.supportApproveAndCall === false) ? (
                    <ApproveThenCall provider={provider} config={config} />
                ) : (
                    <ApproveAndCall provider={provider} walletHelper={walletHelper} config={config} />
                ) }
            </React.Fragment>
        );
    }
}

export default ExampleApp;
