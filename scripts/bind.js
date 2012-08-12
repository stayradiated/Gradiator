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

	var isNumberKey = function(e) {
		return (
			e.ctrlKey || e.altKey ||
		(47<e.keyCode && e.keyCode<58 && e.shiftKey===false) ||
		(95<e.keyCode && e.keyCode<106 ||
			(e.keyCode==8) || (e.keyCode==9) ||
			(e.keyCode>34 && e.keyCode<40) ||
			(e.keyCode==46)
		));
	};

	var handleInput = function($this, e, callback) {

		var raw = $this.val(),
			out = raw;

		if (out === 0) {
			out = "";
		}

		// console.log("Init: " + out);

		console.log(isNumberKey(e));
		if (isNumberKey(e)) {
			out += String.fromCharCode(e.keyCode);
		} else {
			e.preventDefault();
		}

		if (out === "") {
			out = 0;
		}

		// out = Number(out);

		console.log("Processed: " + out);

		callback(out);

		if (raw.length > 3) $this.val(raw.slice(0,2));
		if (out > 100) {
			$this.val(100);
			e.preventDefault();
		} else if (out < 0) $this.val(0);

		// console.log("Val: " + out);

	};

	$$.editor.settings.position.input.change(function() {
		var $this = $(this);
		var pos = Number($this.val());
		app.selected.stop.set({pos: pos});
	});

	$$.editor.settings.position.input.keydown(function(e) {
		handleInput($(this), e, function(val) {
			app.selected.stop.set({pos: val});
		});
	});

	$$.editor.settings.alpha.input.change(function() {
		var $this = $(this);
		var val = Number($this.val());
		app.selected.stop.set({alpha: val});
	});

	$$.editor.settings.alpha.input.keydown(function(e) {
		handleInput($(this), e, function(val) {
			app.selected.stop.set({alpha: val});
		});
	});
	
	$$.editor.settings.color.input.change(function() {
		app.selected.stop.set({color: $(this).val()});
	});
	
	$$.editor.settings.remove.button.click(function() {
		app.selected.stop.remove();
	});
	
	$$.sidebar.opacity.change(function() {
		app.selected.layer.set({opacity: $(this).val()});
	});

	$$.editor.slider.el.mousedown(ui.stop().add);
	$$.editor.slider.stops.el.on('mousedown', '.color-stop', ui.mouse.down);
	$(document).mouseup(ui.mouse.up);

});