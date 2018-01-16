/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compact, get } from 'lodash';
import { connect } from 'react-redux';
import { recordTracksEvent } from 'state/analytics/actions';

/**
 * Internal dependencies
 */
import config from 'config';
import Main from 'components/main';
import Wizard from 'components/wizard';
import { addQueryArgs, externalRedirect } from 'lib/route';
import {
	JETPACK_ONBOARDING_COMPONENTS as COMPONENTS,
	JETPACK_ONBOARDING_STEPS as STEPS,
} from './constants';
import { getJetpackOnboardingSettings, getUnconnectedSiteIdBySlug } from 'state/selectors';

class JetpackOnboardingMain extends React.PureComponent {
	static propTypes = {
		stepName: PropTypes.string,
	};

	static defaultProps = {
		stepName: STEPS.SITE_TITLE,
	};

	componentDidMount() {
		const { siteId, siteSlug } = this.props;

		// If we are missing the Jetpack onboarding credentials,
		// redirect back to wp-admin so we can obtain them again.
		if ( ! siteId && siteSlug ) {
			const siteDomain = siteSlug.replace( '::', '/' );
			const url = addQueryArgs(
				{
					page: 'jetpack',
					action: 'onboard',
					calypso_env: config( 'env_id' ),
				},
				`//${ siteDomain }/wp-admin/admin.php`
			);
			externalRedirect( url );
		}
	}

	render() {
		const { recordJpoEvent, siteId, siteSlug, stepName, steps } = this.props;
		return (
			<Main className="jetpack-onboarding">
				{ siteId ? (
					<Wizard
						basePath="/jetpack/onboarding"
						baseSuffix={ siteSlug }
						components={ COMPONENTS }
						hideNavigation={ stepName === STEPS.SUMMARY }
						recordJpoEvent={ recordJpoEvent }
						siteId={ siteId }
						stepName={ stepName }
						steps={ steps }
					/>
				) : (
					<div className="jetpack-onboarding__loading wpcom-site__logo noticon noticon-wordpress" />
				) }
			</Main>
		);
	}
}
export default connect(
	( state, { siteSlug } ) => {
		const siteId = getUnconnectedSiteIdBySlug( state, siteSlug );
		const settings = getJetpackOnboardingSettings( state, siteId );
		const isBusiness = get( settings, 'siteType' ) === 'business';

		// Note: here we can select which steps to display, based on user's input
		const steps = compact( [
			STEPS.SITE_TITLE,
			STEPS.SITE_TYPE,
			STEPS.HOMEPAGE,
			STEPS.CONTACT_FORM,
			isBusiness && STEPS.BUSINESS_ADDRESS,
			isBusiness && STEPS.WOOCOMMERCE,
			STEPS.SUMMARY,
		] );
		return {
			siteId,
			siteSlug,
			steps,
		};
	},
	{ recordTracksEvent },
	( { siteId, ...stateProps }, { recordTracksEvent: recordTracksEventAction }, ownProps ) => ( {
		siteId,
		...stateProps,
		recordJpoEvent: ( event, additionalProperties ) =>
			recordTracksEventAction( event, {
				blog_id: siteId,
				site_id_type: 'jpo',
				...additionalProperties,
			} ),
		...ownProps,
	} )
)( JetpackOnboardingMain );
