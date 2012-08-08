/*
	color.js
	By George Czabania, August 2012
	-------------------------------
	Interface for TinyColor.js
*/

(function() {

	var Color = window.Color = {};

	// Converting between formats
	Color.convert = function( input, outputFormat ) {

		var color = tinycolor(input),
			output;

		switch (outputFormat) {
			case 'object':
				output = color.toRgb();
				console.log(input, output);
				return output;
			case 'hex':
				return color.toHex();
			case 'rgba':
				return color.toRgbString();
		}

	};

})();