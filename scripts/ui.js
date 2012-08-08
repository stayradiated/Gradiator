/*
	ui.js
	By George Czabania, July 2012
	-----------------------------
	Handle the UI

*/

gradiator.init.push(function( app, undefined ) {

	var ui = app.ui;

	// Cache elements

	var $$ = ui.$$ = {
		app: $('#app'),
		editor: {
			preview: $('#gradient-preview .gradient'),
			slider: {
				el: $('#gradient-slider'),
				stops: {
					el: $('#gradient-slider .color-stops'),
					selected: function() {
						return $$.editor.slider.stops.el.find('.selected');
					},
					all: function() {
						return $$.editor.slider.stops.el.find('.color-stop');
					},
					get: function( id ) {
						return $$.editor.slider.stops.el.find('[data-id='+id+']');
					},
					select: function( id ) {
						$$.editor.slider.stops.selected().removeClass('selected');
						var stop = $$.editor.slider.stops.get(id);
						stop.addClass('selected');
						return stop;
					}
				},
				track: $('#gradient-slider .track')
			},
			settings: {
				el: $('#color-stop-settings'),
				alpha: {
					el: $('#color-stop-settings .alpha'),
					input: $('#color-stop-settings .alpha input')
				},
				color: {
					el: $('#color-stop-settings .color'),
					input: $('#color-stop-settings .color input')
				},
				position: {
					el: $('#color-stop-settings .position'),
					input: $('#color-stop-settings .position input')
				},
				remove: {
					el: $('#color-stop-settings .remove'),
					button: $('#color-stop-settings .remove button')
				}
			}
		},
		sidebar: {
			el: $('#sidebar'),
			layers: {
				el: $('#layers'),
				all: function() {
					return $$.sidebar.layers.el.find('.layer');
				},
				selected: function() {
					return $$.sidebar.layers.el.find('.selected');
				},
				get: function( id ) {
					return $$.sidebar.layers.el.find('[data-id='+id+']');
				}
			},
			buttons: {
				addLayer: $('#sidebar .bottom-bar .add-layer'),
				addAdjustmentLayer: $('#sidebar .bottom-bar .add-adjustment-layer'),
				removeLayer: $('#sidebar .bottom-bar .remove-layer')
			}
		}
	};


	// Globals

	var select = ui.select = {

		// Select a layer in the sidebar
		// id: [string|number] the ID of the layer
		layer: function( id ) {

			// Update 'selected' class name
			$$.sidebar.layers.selected().removeClass('selected');
			$$.sidebar.layers.el.find('[data-id=' + id + ']').addClass('selected');
		},

		// Select a stop in a gradient
		// id: [string|number] the ID of the stop
		stop: function( stop ) {

			// Update 'selected' class name
			$$.editor.slider.stops.select(stop.id);

			// Update settings
			ui.settings.update(stop);
		}
	};

	ui.settings = {
		update: function ( stop ) {
			$$.editor.settings.alpha.input.val( stop.color.a * 100 );
			$$.editor.settings.color.input.val( stop.getColor('hex') );
			$$.editor.settings.position.input.val( stop.pos );
		}
	};

	ui.layer = function( layer ) {
		var el = $$.sidebar.layers.get(layer.id);
		return {
			update: function() {
				console.log(layer.visible);
				if (layer.visible) {
					el.removeClass('disabled');
				} else {
					el.addClass('disabled');
				}
			}
		};
	};

	ui.stop = function( stop ) {
		return {
			move: function() {
				var $stop = $$.editor.slider.stops.el.find('[data-id=' + stop.id + ']');
				$stop.css('left', stop.getPos() + "px");
			}
		};
	};


	// Locals

	// Templates
	var templates = {
		layer: _.template($('#layer-template').html()),
		stop: _.template($('#color-stop-template').html())
	};

	// Draw a new layer
	var draw = {
		layer: function( obj ) {
			switch (obj.type) {
				case 'gradient':
					return templates.layer({
						id: obj.id,
						name: obj.name
					});
				case 'color':
					break;
				case 'adjustment':
					break;
			}
		},
		stop: function( obj ) {
			return templates.stop({
				id: obj.id,
				color: obj.getColor(),
				pos: obj.getPos() + "px"
			});
		}
	};
	ui.add = {
		layer: function( obj ) {
			$$.sidebar.layers.el.append(draw.layer(obj));
		},
		stop: function( obj ) {
			$$.editor.slider.stops.el.append(draw.stop(obj));
		}
	};

});