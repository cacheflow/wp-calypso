/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import CredentialsSetupFlow from './credentials-setup-flow/index';
import CredentialsConfigured from './credentials-configured/index';
import Gridicon from 'gridicons';
import QueryJetpackCredentials from 'components/data/query-jetpack-credentials';
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	getJetpackCredentials,
	isUpdatingJetpackCredentials,
	hasMainCredentials,
	isSitePressable,
	getCredentialsAutoConfigStatus
} from 'state/selectors';
import {
	updateCredentials,
	autoConfigCredentials,
	deleteCredentials,
} from 'state/jetpack/credentials/actions';

class Backups extends Component {
	static propTypes = {
		autoConfigStatus: PropTypes.string,
		formIsSubmitting: PropTypes.bool,
		hasMainCredentials: PropTypes.bool,
		mainCredentials: PropTypes.object,
		isPressable: PropTypes.bool,
		siteId: PropTypes.number.isRequired
	};

	render() {
		const {
			autoConfigStatus,
			hasMainCredentials, // eslint-disable-line no-shadow
			isPressable,
			translate,
			formIsSubmitting,
			updateCredentials,
			siteId,
			autoConfigCredentials,
		} = this.props;

		return (
			<div className="jetpack-credentials">
				<QueryJetpackCredentials siteId={ this.props.siteId } />
				<CompactCard className="jetpack-credentials__header">
					<span>{ translate( 'Backups and security scans' ) }</span>
						{ hasMainCredentials && (
							<span className="jetpack-credentials__connected">
								<Gridicon icon="checkmark" size={ 18 } className="jetpack-credentials__connected-checkmark" />
								{ translate( 'Connected' ) }
							</span>
						) }
				</CompactCard>

				{ ! hasMainCredentials && (
					<CredentialsSetupFlow { ...{
						isPressable,
						formIsSubmitting,
						siteId,
						updateCredentials,
						autoConfigCredentials,
						autoConfigStatus
					} } />
				) }

				{ hasMainCredentials && (
					<CredentialsConfigured { ...this.props } />
				) }
			</div>
		);
	}
}

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const credentials = getJetpackCredentials( state, siteId, 'main' );

		return {
			autoConfigStatus: getCredentialsAutoConfigStatus( state, siteId ),
			formIsSubmitting: isUpdatingJetpackCredentials( state, siteId ),
			hasMainCredentials: hasMainCredentials( state, siteId ),
			mainCredentials: credentials,
			isPressable: isSitePressable( state, siteId ),
			siteId,
		};
	}, {
		autoConfigCredentials,
		updateCredentials,
		deleteCredentials,
	}
)( localize( Backups ) );
