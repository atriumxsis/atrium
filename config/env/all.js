'use strict';

var atriumConfig = {
	db: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/atrium',
	app: {
		title: 'Atrium Xsis'
	},
	ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
	tempDataDir: process.env.OPENSHIFT_DATA_DIR || 'data/temp',
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-busy/angular-busy.css',
				'public/lib/ngDialog/css/ngDialog.min.css',
				'public/lib/ngDialog/css/ngDialog-theme-default.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/underscore/underscore.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-busy/angular-busy.js',
				'public/lib/ngDialog/js/ngDialog.min.js',
				'public/lib/bootstrap/js/dropdown.js'
				//'public/lib/script/app.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};


global.atriumConfig = atriumConfig;

module.exports = atriumConfig;
