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
					select: function( query ) {
						$$.editor.slider.stops.selected().removeClass('selected');
						var stop = $$.editor.slider.stops.el.find(query);
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

			console.log("Selecting layer: #" + id);
		},

		// Select a stop in a gradient
		// id: [string|number] the ID of the stop
		stop: function( id ) {

			// Update 'selected' class name
			$$.editor.slider.stops.select('[data-id=' + id + ']');
		}
	};

});