require.config({
    paths: {
        jquery: 'vendor/jquery-1.11.2.min',
    	underscore: 'vendor/underscore-min',
    	backbone: 'vendor/backbone-min',
    	text: 'vendor/text'
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

require([
	  // Load our app module and pass it to our definition function
	  'app',
	], function(App){
	  // The "app" dependency is passed in as "App"
	  App.initialize();
});

