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

	$$.sidebar.layers.el.on('click', '.layer', function(e) {

		var id = $(this).data('id');

		if ($(e.target).is('.visible')) {
			var layer = core.get.layer(id);
			layer.toggle();
			return;
		}

		core.select.layer( id );
	});


	/****************************
		Editor
	*****************************/

	$$.editor.slider.stops.el.on('click', '.color-stop', function() {
		var id = $(this).data('id');
		core.select.stop( app.selected.layer, id );
	});

	$$.editor.settings.position.input.change(function() {
		var pos = $(this).val();
		app.selected.stop.setPos(pos);
	});

});