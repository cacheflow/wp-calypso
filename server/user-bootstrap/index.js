/** @format */
const superagent = require( 'superagent' );
const debug = require( 'debug' )( 'calypso:bootstrap' );
const crypto = require( 'crypto' );

const config = require( 'config' );
const API_KEY = config( 'wpcom_calypso_rest_api_key' );
const userUtils = require( './shared-utils' );
const AUTH_COOKIE_NAME = 'wordpress_logged_in';

/**
 * WordPress.com REST API /me endpoint.
 */
const url = 'https://public-api.wordpress.com/rest/v1/me?meta=flags';

module.exports = function( authCookieValue, callback ) {
	// create HTTP Request object
	const req = superagent.get( url );

	if ( authCookieValue ) {
		authCookieValue = decodeURIComponent( authCookieValue );

		if ( typeof API_KEY !== 'string' ) {
			callback( new Error( 'Unable to boostrap user because of invalid API key in secrets.json' ) );
			return;
		}

		const hmac = crypto.createHmac( 'md5', API_KEY );
		hmac.update( authCookieValue );
		const hash = hmac.digest( 'hex' );

		req.set( 'Authorization', 'X-WPCALYPSO ' + hash );
		req.set( 'Cookie', AUTH_COOKIE_NAME + '=' + authCookieValue );
		req.set( 'User-Agent', 'WordPress.com Calypso' );
	}

	// start the request
	req.end( function( err, res ) {
		if ( err && ! res ) {
			return callback( err );
		}

		const body = res.body;
		const statusCode = res.status;

		debug( '%o -> %o status code', url, statusCode );

		if ( err ) {
			const error = new Error();
			error.statusCode = statusCode;
			for ( const key in body ) {
				error[ key ] = body[ key ];
			}

			return callback( error );
		}

		const user = userUtils.filterUserObject( body );
		callback( null, user );
	} );
};
