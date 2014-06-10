require.config({
	// Initialize the application with the main application file
    deps: ['assets/js/main'],

	//baseUrl: '../',
	
	paths: {
		// JavaScript folders
        core: 'common/com/codeboxsystems/core',
        canvas: 'common/com/codeboxsystems/canvas',
        dom: 'common/com/codeboxsystems/dom',
        threejsx: 'common/com/codeboxsystems/threejsx',
        libs: 'common/libs',
        proj: 'assets/js',
		
		// Libraries
        threejs: 'common/libs/three.js/three',
        FirstPersonControls: 'common/libs/three.js/FirstPersonControls',
        TrackballControls: 'common/libs/three.js/TrackballControls',
        Leap: 'common/libs/leap',
        jquery: 'common/libs/jquery-1.8.1',
        TweenMax: 'common/libs/TweenMax.min',
        TimelineMax: 'common/libs/TimelineMax.min',
        ImprovedNoise: 'common/libs/ImprovedNoise',
        modernizr: 'common/libs/modernizr.custom.51462',
        text: 'common/libs/text',

		// Shim plugin
        use: 'common/libs/use',
	},
	
	use: {
		'FirstPersonControls': {
			attach: 'FirstPersonControls',
			deps: ['threejs']
		},
		'TrackballControls': {
			attach: 'TrackballControls',
			deps: ['threejs']
		}
	}
});
