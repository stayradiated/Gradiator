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

		// Angle between 0 and 360
		this.direction = 0;

		// Layer visiblity
		this.visible = settings.visible;
		this.toggle = function() {
			this.visible = !this.visible;
			ui.layer(this).update();
		};

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

	Layer.prototype.getStops = function() {
		var results = [];
		for (var i = 0, stop; stop = this.stops[i]; i++) {
			results.push([
				stop.get('color'),
				stop.pos
			]);
		}
		return results;
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

		this.set({
			color: settings.color,
			pos: settings.pos
		});

		ui.add.stop(this);

	};

	Stop.prototype.set = function( _settings ) {

		var settings = defaults(_settings, {
			pos: undefined,
			color: undefined,
			alpha: undefined
		});

		if (settings.pos !== undefined) {
			if (settings.pos > 100) settings.pos = 100;
			else if (settings.pos < 0) settings.pos = 0;
			else settings.pos = Math.round(settings.pos);
			this.pos = settings.pos;
			ui.stop(this).move(this.pos);
			ui.settings.update(this);
		}

		if (settings.color !== undefined) {
			this.color = Color.convert(settings.color, 'object');
		}

		if (settings.alpha !== undefined) {
			this.color.a = settings.alpha;
		}

	};

	Stop.prototype.get = function( type ) {
		switch (type) {
			case 'color':
				type = arguments[1] || 'rgba';
				return Color.convert(this.color, type);
			case 'pos':
				var max = ui.$$.editor.slider.width;
				return (this.pos * max / 100) + "px";
		}
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
		stop: function( obj, layer ) {
			if (!(obj instanceof Stop)) {
				obj = getStop(obj, layer);
			}
			if (obj) {
				selected.stop = obj;
				ui.select.stop(obj);
			}
		}
	};

	// Generate Gradient

	core.gradient = {
		render: function ( _settings ) {
			var settings = defaults(_settings, {
				gradient: false,
				template: [],
				fallback: false,
				colorFormat: 'hex'
			});

			// Gradient must be a Gradient object.

			// Accepted templates:
			// webkit, webkit_legacy, moz, ms, ms_legacy, o, standard, svg
			// sass, scss, less

			// Accepted fallbacks:
			// false (no fallback), first, last, average

			// Accepted colorFormats:
			// hex, rgb, hsl

			var stops = settings.gradient.getStops(),
				output = "-webkit-linear-gradient(left, ";

			for (var i = 0; i < stops.length; i++) {
				var stop = stops[i];
				if (i == stops.length - 1) {
					output += stop[0] + " " + stop[1] + "%)";
				} else {
					output += stop[0] + " " + stop[1] + "%, ";
				}
			}

			return output;

		}

	};

	// Utils

	// Merges two objects with priority to user
	var defaults = function( user, def ) {

		if (user === undefined) return def;

		var results = {};
		for (var key in def) {
			if (typeof(def[key]) == 'object') {
				results[key] = defaults(user[key], def[key]);
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