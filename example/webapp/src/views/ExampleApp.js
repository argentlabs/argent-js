import React from 'react';

import SignMessage from './actions/SignMessage';
import ApproveAndCall from './actions/ApproveAndCall';
import ApproveThenCall from './actions/ApproveThenCall';

class ExampleApp extends React.Component {
    render() {
        const {
            provider,
            wallet,
            config
        } = this.props;

        return (
            <React.Fragment>
                <SignMessage provider={provider} wallet={wallet} />
                { (wallet.supportApproveAndCall === false) ? (
                    <ApproveThenCall provider={provider} config={config} />
                ) : (
                    <ApproveAndCall provider={provider} wallet={wallet} config={config} />
                ) }
            </React.Fragment>
        );
    }
}

export default ExampleApp;
