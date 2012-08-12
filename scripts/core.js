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
	
	/*
		Layer
	*/
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
		this.opacity = 100;

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
		
	// Convert gradient to CSS (or other format)
	Layer.prototype.render = function( _settings ) {
		var settings = defaults(_settings, {
			template: [],
			fallback: false,
			colorFormat: 'hex'
		});

		// template: 	webkit, webkit_legacy, moz, ms, ms_legacy, o, standard, svg, sass, scss, less
		// fallback: 	false (no fallback), first, last, average
		// colorFormat: hex, rgb, hsl

		var stops = this.getStops(),
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
	};

	// Add a color-stop to a gradient
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
	
	// Get an array of all color-stops
	// [["#ffffff", 0],["808080", 50],["#000000", 100],[<color>, <pos>]]
	Layer.prototype.getStops = function() {
		var results = [];
		for (var i = 0, stop; stop = this.stops[i]; i++) {
			results.push([
				stop.get('colorWithLayerStyles'),
				stop.pos
			]);
		}
		return results;
	};
	
	// Sort stops by position
	Layer.prototype.sortStops = function() {
		var order = {
			old: this.stops,
			new: []
		};
		order.new = order.old.sort(function(a,b) {
			return a.pos - b.pos;
		});
		this.stops = order.new;
		return this.stops;
	};
	
	// Change layer values
	Layer.prototype.set = function( _settings ) {
		var settings = defaults(_settings, {
			opacity: undefined
		});
		if (settings.opacity !== undefined) {
			this.opacity = settings.opacity;
			ui.preview();
		}
	};
	
	
	/*
		Color Stop
	*/
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
	
	// Set value
	Stop.prototype.set = function( _settings ) {

		var settings = defaults(_settings, {
			pos: undefined,
			color: undefined,
			alpha: undefined
		});
		
		// Set position
		if (settings.pos !== undefined) {
			
			// Make sure it is within 0 - 100
			if (settings.pos > 100) settings.pos = 100;
			else if (settings.pos < 0) settings.pos = 0;
			
			// And that is a whole number
			else settings.pos = Math.round(settings.pos);
			
			// Update pos and sort stops
			this.pos = settings.pos;
			this.layer.sortStops();
			
			// Update UI
			ui.stop(this).move(this.pos);
		}

		if (settings.color !== undefined) {
			this.color = Color.convert(settings.color, 'object');
			ui.stop(this).update();
		}

		if (settings.alpha !== undefined) {
			settings.alpha /= 100;
			this.color.a = settings.alpha;
			ui.stop(this).update();
		}
		
		ui.settings.update(this);
		ui.preview();

	};
	
	// Get value
	Stop.prototype.get = function( type ) {
		switch (type) {
			case 'color':
				type = arguments[1] || 'rgba';
				return Color.convert(this.color, type);
			case 'colorWithLayerStyles':
			type = arguments[1] || 'rgba';
				return Color.convert({
					r: this.color.r,
					g: this.color.g,
					b: this.color.b,
					a: this.color.a / (100/this.layer.opacity)
				}, type);
			case 'pos':
				var max = ui.$$.editor.slider.width - 3;
				return (this.pos * max / 100) + "px";
		}
	};
	
	// Remove stop
	Stop.prototype.remove = function() {
		if (this.layer.stops.length > 2) {
			var index = this.layer.stops.indexOf(this);
			this.layer.stops.splice(index, 1);
			ui.get.stop(this.id).remove();
			ui.preview();
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
		layers[1].addStop({
			color: 'rgba(0,100,0,1)',
			pos: 0
		});
		layers[1].addStop({
			color: 'lightblue',
			pos: 100
		});
		
		layers[2].addStop({
			color: 'rgba(200,100,0,1)',
			pos: 0
		});
		layers[2].addStop({
			color: 'green',
			pos: 75
		});
		
		select.stop( selected.layer, 0 );
	};

});