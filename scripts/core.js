/*
	core.js
	By George Czabania, July 2012
	-----------------------------
	Behind the scenes functions
*/

gradiator.init.push(function( app, undefined ) {

	// Namespaces
	var core = app.core,
		ui = app.ui;

	/* Constructors */

	var Gradient = function() {
		this.stops = [];
		this.addStop = function( color ) {
			this.stops.push( new Stop( color ) );
		};
		this.id = layers.length + 1;
		this.name = "New Gradient";
	};

	var Stop = function( color ) {
		color = color || 'blue';
		this.color = color;
	};


	// Global vars

	var layers = app.layers = [];
	var selected = app.selected = {
		layer: undefined,
		stop: undefined
	};


	// Local vars

	core.get = {};
	var getLayer = core.get.layer = function( id ) {
		for (var i = 0; i < layers.length; i++) {
			if (layers[i].id == id) {
				return layers[i];
			}
		}
		return false;
	};
	var getStop = core.get.stop = function( id ) {
		return id;
	};

	var select = core.select = {
		layer: function( obj ) {
			if (!(obj instanceof Gradient)) {
				obj = getLayer(obj);
			}

			if (obj) {
				selected.layer = obj;
				ui.select.layer(obj.id);
			}
		},
		stop: function( obj ) {
			if (typeof(obj) == 'string') {
				obj = getStop(obj);
			}

			selected.stop = obj;
			ui.select.stop(obj);
		}
	};

	core.init = function() {
		layers.push( new Gradient() );
		layers.push( new Gradient() );
		layers.push( new Gradient() );
		select.layer( layers[0] );
		layers[0].addStop( 'green' );
	};

});