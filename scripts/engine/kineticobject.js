define([],
function() {
	function constructor() {
		
		var that = this;

		//helpers
		function generateTransforms(elem) {
			var transformString = '';
			transformString += 'translate3d(' + elem._x + 'px, ' + elem._y + 'px, 0) ';
			if (elem._rotation) {
				transformString += 'rotate3d(0, 0, 1, ' + elem._rotation + 'deg) ';
			}
			if (elem._scaleX && elem._scaleY) {
				transformString += 'scale3d(' + elem._scaleX + ', ' + elem._scaleY + ', 1) ';
			}

			elem.style.webkitTransform = transformString;
		}

		function generateTransformOrigin(elem) {
			elem.style.webkitTransformOrigin = elem._transformOrigin.x + ' ' + elem._transformOrigin.y;
		}
		//end helpers

		var elem = document.createElement('div');
		elem.classList.add('kinetic');

		//Set default position
		elem._x = 0;
		elem._y = 0;

		function retObj() {

		}

		retObj.addToCanvas = function (canvas) {
			canvas.appendChild(elem);
		}

		//Defaults
		Object.defineProperty(retObj, "defaults", {
			get: function() {
				return {
					transformOrigin: {x: '50%', y: '50%'},
				}
			}
		})

		//Property Definitions
		Object.defineProperty(retObj, 'transformOrigin', {
			get: function() {
				return elem._transformOrigin;
			},
			set: function(val) {
				if (val.x === undefined || val.y === undefined)
					return;
				//TODO: Validation
				elem._transformOrigin = val;
				generateTransformOrigin(elem);
			}
		})
		Object.defineProperty(retObj, "x", {
			get: function() {
				return elem._x;
			},
			set: function(val) {
				elem._x = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, "y", {
			get: function() {
				return elem._y;
			},
			set: function(val) {
				elem._y = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, "rotation", {
			get: function() {
				return elem._rotation;
			},
			set: function(val) {
				elem._rotation = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, "scale", {
			get: function() {
				//only return a value if scaleX and scaleY are the same
				if (elem._scaleX === elem._scaleY)
					return elem._scaleX;
				return undefined;
			},
			set: function(val) {
				elem._scaleX = val;
				elem._scaleY = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, "scaleX", {
			get: function() {
				return elem._scaleX;
			},
			set: function(val) {
				elem._scaleX = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, "scaleY", {
			get: function() {
				return elem._scaleY;
			},
			set: function(val) {
				elem._scaleY = val;
				generateTransforms(elem);
			}
		});

		Object.defineProperty(retObj, 'width', {
			get: function() {
				return elem.offsetWidth;
			}
		});

		Object.defineProperty(retObj, 'height', {
			get: function() {
				return elem.offsetHeight;
			}
		})

		Object.defineProperty(retObj, "elem", {
			get: function() {
				return elem;
			},
			set: function(val) {
				elem = val;
			}
		});

		return retObj;
	}

	return constructor;
});