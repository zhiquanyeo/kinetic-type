define(['engine/numberattribute'],
function(NumberAttribute) {
	function constructor(name, delay, duration) {
		
		var that = this;
		var PRETIME = 0;
		var INTIME = 1;
		var POSTTIME = 2;

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

		retObj._name = null;
		retObj._currTimeState = PRETIME;
		retObj._canvas = null;
		retObj._visible = true;

		//End internal set up

		retObj.addToCanvas = function (canvas) {
			canvas.appendChild(elem);
			retObj._canvas = canvas;
		};

		//Defaults
		Object.defineProperty(retObj, "defaults", {
			get: function() {
				return {
					transformOrigin: {x: '50%', y: '50%'}
				};
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
		});

		Object.defineProperty(retObj, "elem", {
			get: function() {
				return elem;
			},
			set: function(val) {
				elem = val;
			}
		});

		Object.defineProperty(retObj, 'visible', {
			get: function() {
				return retObj._visible;
			},
			set: function(val) {
				retObj._visible = val;
			}
		});

		Object.defineProperty(retObj, 'duration', {
			get: function() {
				return retObj._duration.val;
			},
			set: function(val) {
				retObj._duration.val = val;
			}
		});

		Object.defineProperty(retObj, 'delay', {
			get: function() {
				return retObj._delay.val;
			},
			set: function(val) {
				retObj._delay.val = val;
			}
		});

		Object.defineProperty(retObj, 'time', {
			get: function() {
				return retObj._time.val;
			},
			set: function(val) {
				retObj._time.val = val;
			}
		});

		//Public Methods

		retObj.getName = function() {
			return retObj._name;
		};

		/**
		 * This function updates the time state of this object, and then updates
		 * the time. On the update pass in the main engine, all the KineticObjects
		 * will be update()-d with their own copy of the timeline (after translation)
		 */
		retObj.update = function(timeline) {
			var tempT = timeline.getTime();

			// We are interested in the following:
			// 1. Timeline time is NOT NaN and _currTimeState is PRETIME
			// 2. Timeline time is NaN and _currTimeState is INTIME
			if (retObj._currTimeState === PRETIME && !isNaN(tempT)) {
				//Set the state to INTIME
				retObj._currTimeState = INTIME;
			}
			else if (retObj._currTimeState === INTIME && isNaN(tempT)) {
				retObj._currTimeState = POSTTIME;
			}

			//Only change if we are INTIME
			if (retObj._currTimeState === INTIME) {
				retObj._time.val = tempT;
			}
		};

		retObj.draw = function() {
			//TODO Implement
			//Basically generate all the transforms
			if (retObj._currTimeState === POSTTIME || retObj._currTimeState === PRETIME) {
				retObj.elem.style.display = 'none';
			}
			else {
				retObj.elem.style.display = 'block';
			}

			generateTransforms(retObj);
		};

		retObj.getCurrTimeState = function() {
			return retObj._currTimeState;
		};


		//=== Object Init ===
		retObj._name = name;
		retObj._delay.val = delay || 0;
		retObj._duration.val = duration || Number.POSITIVE_INFINITY;

		return retObj;
	}

	return constructor;
});