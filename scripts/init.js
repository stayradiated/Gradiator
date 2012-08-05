// Start app on DOM load
$(function() {

	// Load JS
	for (var i = 0; i < gradiator.init.length; i++) {
		gradiator.init[i](gradiator);
	}

	// Create new Gradient
	gradiator.core.init();

});