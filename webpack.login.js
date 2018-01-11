const path = require( 'path' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const webpack = require( 'webpack' );

// const babelLoader = {
// 	loader: 'babel-loader',
// 	options: {
// 		cacheDirectory: path.join( __dirname, 'build', '.babel-client-cache' ),
// 		cacheIdentifier: cacheIdentifier,
// 		plugins: [
// 			[
// 				path.join(
// 					__dirname,
// 					'server',
// 					'bundler',
// 					'babel',
// 					'babel-plugin-transform-wpcalypso-async'
// 				),
// 				{ async: true },
// 			],
// 		],
// 	},
// };

const config = {
	entry: {
		build: path.join( path.resolve( __dirname ), 'client', 'login' ),
		vendor: [
			'classnames',
			'create-react-class',
			'gridicons',
			'i18n-calypso',
			'immutable',
			'lodash',
			'moment',
			'page',
			'prop-types',
			'react',
			'react-dom',
			'react-redux',
			'redux',
			'redux-thunk',
			'social-logos',
			'store',
			'wpcom',
		],
	},
	output: {
		filename: '[name].[chunkhash].min.js', // prefer the chunkhash, which depends on the chunk, not the entire build
		chunkFilename: '[name].[chunkhash].min.js', // ditto
		path: path.resolve( 'login-build' ),
	},
	module: {
		loaders: [
				{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules[\/\\](?!notifications-panel)/ },
				{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules[\/\\](?!notifications-panel)/ },
		],
	},
	resolve: {
		extensions: [ '.json', '.js', '.jsx' ],
		modules: [ path.join( path.resolve( __dirname ), 'client' ), 'node_modules' ],
		alias: Object.assign(
			{
				'react-virtualized': 'react-virtualized/dist/commonjs',
				'social-logos/example': 'social-logos/build/example',
			}, {}
		),
	},
	node: {
		console: false,
		process: true,
		global: true,
		Buffer: true,
		__filename: 'mock',
		__dirname: 'mock',
		fs: 'empty',
	},
	plugins: [
		new UglifyJSPlugin(),
		new webpack.optimize.CommonsChunkPlugin( { name: 'vendor', minChunks: Infinity } ),
		new webpack.NormalModuleReplacementPlugin(
			/layout-wrapper\/logged-in/,
			'layout-wrapper/logged-out'
		),
	],
	externals: [
		'jquery',
	],
};

module.exports = config;
