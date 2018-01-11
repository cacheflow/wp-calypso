/**
 * External dependencies
 *
 * @format
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { jsonStringifyForHtml } from '../../server/sanitize';
import Head from '../components/head';
import Masterbar from '../layout/masterbar/masterbar.jsx';
import getStylesheetUrl from './utils/stylesheet';

class Document extends React.Component {
	render() {
		const {
			app,
			chunk,
			faviconURL,
			head,
			i18nLocaleScript,
			initialReduxState,
			isRTL,
			jsFile,
			lang,
			renderedLayout,
			user,
			urls,
			hasSecondary,
			sectionGroup,
			config,
			isFluidWidth,
			sectionCss,
			env,
			isDebug,
			badge,
			abTestHelper,
			branchName,
			commitChecksum,
			devDocs,
			devDocsURL,
			feedbackURL,
		} = this.props;

		return (
			<html
				lang={ lang }
				dir={ isRTL ? 'rtl' : 'ltr' }
				className={ classNames( { 'is-fluid-width': isFluidWidth } ) }
			>
				<Head title={ head.title } faviconURL={ faviconURL } cdn={ '//s1.wp.com' }>
					{ head.metas.map( props => <meta { ...props } /> ) }
					{ head.links.map( props => <link { ...props } /> ) }

					<link
						rel="stylesheet"
						id="main-css"
						href={ urls[ getStylesheetUrl( { isRTL, isDebug, env } ) ] }
						type="text/css"
					/>
					{ sectionCss && (
						<link
							rel="stylesheet"
							id={ 'section-css-' + sectionCss.id }
							href={ get( sectionCss, `urls.${ isRTL ? 'rtl' : 'ltr' }` ) }
							type="text/css"
						/>
					) }
				</Head>
				<body className={ classNames( { rtl: isRTL } ) }>
					{ /* eslint-disable wpcalypso/jsx-classname-namespace, react/no-danger */ }
					{ renderedLayout ? (
						<div
							id="wpcom"
							className="wpcom-site"
							dangerouslySetInnerHTML={ {
								__html: renderedLayout,
							} }
						/>
					) : (
						<div id="wpcom" className="wpcom-site">
							<div
								className={ classNames( 'layout', {
									[ 'is-group-' + sectionGroup ]: sectionGroup,
								} ) }
							>
								<Masterbar />
								<div className="layout__content">
									<div className="wpcom-site__logo noticon noticon-wordpress" />
									{ hasSecondary && (
										<Fragment>
											<div className="layout__secondary" />
											<ul className="sidebar" />
										</Fragment>
									) }
									{ sectionGroup === 'editor' && (
										<div className="card editor-ground-control">
											<div className="editor-ground-control__action-buttons" />
										</div>
									) }
								</div>
							</div>
						</div>
					) }
					{ badge && (
						<div className="environment-badge">
							{ abTestHelper && <div className="environment is-tests" /> }
							{ branchName &&
								branchName !== 'master' && (
									<span className="environment branch-name" title={ 'Commit ' + commitChecksum }>
										{ branchName }
									</span>
								) }
							{ devDocs && (
								<span className="environment is-docs">
									<a href={ devDocsURL } title="DevDocs">
										docs
									</a>
								</span>
							) }
							<span className={ `environment is-${ badge } is-env` }>{ badge }</span>
							<a
								className="bug-report"
								href={ feedbackURL }
								title="Report an issue"
								target="_blank"
							/>
						</div>
					) }

					{ user && (
						<script
							type="text/javascript"
							dangerouslySetInnerHTML={ {
								__html: 'var currentUser = ' + jsonStringifyForHtml( user ),
							} }
						/>
					) }
					{ app && (
						<script
							type="text/javascript"
							dangerouslySetInnerHTML={ {
								__html: 'var app = ' + jsonStringifyForHtml( app ),
							} }
						/>
					) }
					{ initialReduxState && (
						<script
							type="text/javascript"
							dangerouslySetInnerHTML={ {
								__html: 'var initialReduxState = ' + jsonStringifyForHtml( initialReduxState ),
							} }
						/>
					) }
					{ config && (
						<script
							type="text/javascript"
							dangerouslySetInnerHTML={ {
								__html: config,
							} }
						/>
					) }
					{ i18nLocaleScript && <script src={ i18nLocaleScript } /> }
					<script src={ urls.manifest } />
					<script src={ urls.vendor } />
					<script src={ urls[ jsFile ] } />
					{ chunk && <script src={ urls[ chunk ] } /> }
					<script>window.AppBoot();</script>
					<noscript className="wpcom-site__global-noscript">
						Please enable JavaScript in your browser to enjoy WordPress.com.
					</noscript>
					{ /* eslint-enable wpcalypso/jsx-classname-namespace, react/no-danger */ }
				</body>
			</html>
		);
	}
}

export default Document;
