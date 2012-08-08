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

	var Layer = function( _settings ) {

		settings = defaults(_settings, {
			name: 'New Layer',
			type: 'gradient',
			visible: true
		});

		this.stops = [];
		this.id = layers.length + 1;
		this.name = settings.name;
		this.type = settings.type;
		this.visible = settings.visible;

		ui.add.layer(this);

	};

	Layer.prototype.addStop = function( _settings ) {

		settings = defaults(_settings, {
			color: 'blue',
			pos: 0
		});

		this.stops.push( new Stop( {
			id: this.stops.length,
			pos: settings.pos,
			color: settings.color,
			layer: this
		}));
	};

	var Stop = function( settings ) {

		this.layer = settings.layer;
		this.id = settings.id;
		this.color = {
			a: 1,
			r: 255,
			g: 255,
			b: 255
		};
		this.pos = settings.pos;

		this.setColor = function(color) {
			this.color = Color.convert(color, 'object');
		};
		this.getColor = function() {
			return Color.convert(this.color, 'rgba');
		};

		// Set color
		this.setColor(settings.color);

		this.getPos = function() {
			var max = ui.$$.editor.slider.el.width();
			return this.pos * max / 100;
		};

		ui.add.stop(this);

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
	var getStop = core.get.stop = function( layer, id ) {
		for (var i = 0; i <  layer.stops.length; i++) {
			if (layer.stops[i].id == id) {
				return layer.stops[i];
			}
		}
		return false;
	};

	var select = core.select = {
		layer: function( obj ) {
			if (!(obj instanceof Layer)) {
				obj = getLayer(obj);
			}

			if (obj) {
				selected.layer = obj;
				ui.select.layer(obj.id);
			}
		},
		stop: function( obj ) {
			selected.stop = obj;
			ui.select.stop(obj);
		}
	};

	// Utils

	// Merges two objects with priority to user
	var defaults = function( user, def ) {

		if (user === undefined) return def;

		var results = {};
		for (var key in def) {
			if (typeof(def[key]) == 'object') {
				results[key] = def(user[key], def[key]);
			} else if (user.hasOwnProperty(key)) {
				results[key] = user[key];
			} else {
				results[key] = def[key];
			}
		}

		return results;

	};

	// Init

	core.init = function() {
		layers.push( new Layer({name: 'Green Button'}) );
		layers.push( new Layer({name: 'Red Button'}) );
		layers.push( new Layer({name: 'Blue Button'}) );
		select.layer( layers[0] );
		layers[0].addStop({
			color: '#bada55',
			pos: 0
		});
		layers[0].addStop({
			color: 'rgba(200,100,0,0.5)',
			pos: 75
		});
		layers[0].addStop({
			color: 'lightblue',
			pos: 100
		});
	};

});