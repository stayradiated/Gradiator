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

	var isNumberKey = function(e) {
		if (e.keyCode != 46 && e.keyCode > 31 &&
			(e.keyCode < 48 || e.keyCode > 57)) {
			return false;
		}
		return true;
	};

	$$.editor.settings.position.input.change(function() {
		var $this = $(this);

		var pos = Number($this.val());
		app.selected.stop.set({pos: pos});
	});

	$$.editor.settings.position.input.keydown(function(e) {
		var $this = $(this);

		var raw = $this.val(),
			pos = Number(raw);

		if (isNumberKey(e)) {
			pos += String.fromCharCode(e.keyCode);
		} else {
			return false;
		}

		app.selected.stop.set({pos: pos});
		if (raw.length > 3) $this.val(raw.slice(0,2));
		if (pos > 100) {
			$this.val(100);
			return false;
		} else if (pos < 0) $this.val(0);
	});

});