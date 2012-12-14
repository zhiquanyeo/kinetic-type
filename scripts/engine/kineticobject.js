define(['engine/numberattribute'],
function(NumberAttribute) {
	function constructor() {
		
		var that = this;

		//helpers
		function generateTransforms(ktobj) {
			var elem = ktobj.elem;
			var transformString = '';
			transformString += 'translate3d(' + ktobj._x.val + 'px, ' + ktobj._y.val + 'px, 0) ';
			transformString += 'rotate3d(0, 0, 1, ' + ktobj._rotation.val + 'deg) ';
			transformString += 'scale3d(' + ktobj._scaleX.val + ', ' + ktobj._scaleY.val + ', 1) ';
		
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

		//Set up the internal stuff
		retObj._x = new NumberAttribute(0);
		retObj._y = new NumberAttribute(0);
		retObj._rotation = new NumberAttribute(0);
		retObj._scaleX = new NumberAttribute(1);
		retObj._scaleY = new NumberAttribute(1);
		retObj._shearX = new NumberAttribute(0);
		retObj._shearY = new NumberAttribute(0);

		//timing and duration
		retObj._duration = new NumberAttribute(Number.POSITIVE_INFINITY);
		retObj._delay = new NumberAttribute(0);
		retObj._time = new NumberAttribute(0);

		//End internal set up

		retObj.addToCanvas = function (canvas) {
			canvas.appendChild(elem);
		}

		//Defaults
		Object.defineProperty(retObj, "defaults", {
			get: function() {
				return {
					transformOrigin: {x: '50%', y: '50%'}
				}
			}
		});

		/*
		The general idea: 
		Each property here is actually backed by a NumberAttribute, which
		we then use to change the values needed by the elem
		*/

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
		});

		Object.defineProperty(retObj, "x", {
			get: function() {
				return retObj._x.val;
			},
			set: function(val) {
				retObj._x.val = val;
				generateTransforms(retObj);
			}
		});

		Object.defineProperty(retObj, "y", {
			get: function() {
				return retObj._y.val;
			},
			set: function(val) {
				retObj._y.val = val;
				generateTransforms(retObj);
			}
		});

		Object.defineProperty(retObj, "rotation", {
			get: function() {
				return retObj._rotation.val;
			},
			set: function(val) {
				retObj._rotation.val = val;
				generateTransforms(retObj);
			}
		});

		Object.defineProperty(retObj, "scale", {
			get: function() {
				//only return a value if scaleX and scaleY are the same
				if (retObj._scaleX.val === retObj._scaleY.val)
					return retObj._scaleX.val;
				return undefined;
			},
			set: function(val) {
				retObj._scaleX.val = val;
				retObj._scaleY.val = val;
				generateTransforms(retObj);
			}
		});

		Object.defineProperty(retObj, "scaleX", {
			get: function() {
				return retObj._scaleX.val;
			},
			set: function(val) {
				retObj._scaleX.val = val;
				generateTransforms(retObj);
			}
		});

		Object.defineProperty(retObj, "scaleY", {
			get: function() {
				return retObj._scaleY.val;
			},
			set: function(val) {
				retObj._scaleY.val = val;
				generateTransforms(retObj);
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