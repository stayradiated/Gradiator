/*
	bind.js
	By George Czabania, August 2012
	-------------------------------
	Binds DOM elements to JS functions
*/

gradiator.init.push(function(app, undefined) {

	var ui = app.ui,
		core = app.core,
		$$ = ui.$$;

	/****************************
		Sidebar
	*****************************/

	$$.sidebar.layers.el.on('click', '.layer', function() {
		var id = $(this).data('id');
		core.select.layer(id);
	});


	/****************************
		Editor
	*****************************/

	$$.editor.slider.stops.el.on('click', '.color-stop', function() {
		var id = $(this).data('id');
		core.select.stop(id);
	});

});