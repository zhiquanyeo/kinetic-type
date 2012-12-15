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
			transformString += 'translate3d(' + ktobj._x.val + 'px, ' + ktobj._y.val + 'px, 0px) ';
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

		function KTObject() {

		}

		//Set up the internal stuff
		KTObject._x = new NumberAttribute(0);
		KTObject._y = new NumberAttribute(0);
		KTObject._rotation = new NumberAttribute(0);
		KTObject._scaleX = new NumberAttribute(1);
		KTObject._scaleY = new NumberAttribute(1);
		KTObject._shearX = new NumberAttribute(0);
		KTObject._shearY = new NumberAttribute(0);

		//timing and duration
		KTObject._duration = new NumberAttribute(Number.POSITIVE_INFINITY);
		KTObject._delay = new NumberAttribute(0);
		KTObject._time = new NumberAttribute(0);

		KTObject._name = null;
		KTObject._currTimeState = PRETIME;
		KTObject._canvas = null;
		KTObject._visible = true;

		//End internal set up

		KTObject.addToCanvas = function (canvas) {
			canvas.appendChild(elem);
			KTObject._canvas = canvas;
		};

		//Defaults
		Object.defineProperty(KTObject, "defaults", {
			get: function() {
				return {
					transformOrigin: {x: '50%', y: '50%'}
				};
			}
		});

		//Enums
		Object.defineProperty(KTObject, 'enums', {
			get: function() {
				return {
					timeState: {
						INTIME: INTIME,
						PRETIME: PRETIME,
						POSTTIME: POSTTIME
					}
				};
			}
		});


		/*
		The general idea:
		Each property here is actually backed by a NumberAttribute, which
		we then use to change the values needed by the elem
		*/

		//Property Definitions
		Object.defineProperty(KTObject, 'transformOrigin', {
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

		Object.defineProperty(KTObject, "x", {
			get: function() {
				return KTObject._x.val;
			},
			set: function(val) {
				KTObject._x.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, "y", {
			get: function() {
				return KTObject._y.val;
			},
			set: function(val) {
				KTObject._y.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, "rotation", {
			get: function() {
				return KTObject._rotation.val;
			},
			set: function(val) {
				KTObject._rotation.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, "scale", {
			get: function() {
				//only return a value if scaleX and scaleY are the same
				if (KTObject._scaleX.val === KTObject._scaleY.val)
					return KTObject._scaleX.val;
				return undefined;
			},
			set: function(val) {
				KTObject._scaleX.val = val;
				KTObject._scaleY.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, "scaleX", {
			get: function() {
				return KTObject._scaleX.val;
			},
			set: function(val) {
				KTObject._scaleX.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, "scaleY", {
			get: function() {
				return KTObject._scaleY.val;
			},
			set: function(val) {
				KTObject._scaleY.val = val;
				generateTransforms(KTObject);
			}
		});

		Object.defineProperty(KTObject, 'width', {
			get: function() {
				return elem.offsetWidth;
			}
		});

		Object.defineProperty(KTObject, 'height', {
			get: function() {
				return elem.offsetHeight;
			}
		});

		Object.defineProperty(KTObject, "elem", {
			get: function() {
				return elem;
			},
			set: function(val) {
				elem = val;
			}
		});

		Object.defineProperty(KTObject, 'visible', {
			get: function() {
				return KTObject._visible;
			},
			set: function(val) {
				KTObject._visible = val;
			}
		});

		Object.defineProperty(KTObject, 'duration', {
			get: function() {
				return KTObject._duration.val;
			},
			set: function(val) {
				KTObject._duration.val = val;
			}
		});

		Object.defineProperty(KTObject, 'delay', {
			get: function() {
				return KTObject._delay.val;
			},
			set: function(val) {
				KTObject._delay.val = val;
			}
		});

		Object.defineProperty(KTObject, 'time', {
			get: function() {
				return KTObject._time.val;
			},
			set: function(val) {
				KTObject._time.val = val;
			}
		});

		Object.defineProperty(KTObject, 'currTimeState', {
			get: function() {
				return KTObject._currTimeState;
			},
			set: function(val) {
				KTObject._currTimeState = val;
			}
		});

		//Public Methods

		KTObject.getName = function() {
			return KTObject._name;
		};

		/**
		 * This function updates the time state of this object, and then updates
		 * the time. On the update pass in the main engine, all the KineticObjects
		 * will be update()-d with their own copy of the timeline (after translation)
		 */
		KTObject.update = function(timeline) {
			var tempT = timeline.getTime();

			// We are interested in the following:
			// 1. Timeline time is NOT NaN and _currTimeState is PRETIME
			// 2. Timeline time is NaN and _currTimeState is INTIME
			if (KTObject._currTimeState === PRETIME && !isNaN(tempT)) {
				//Set the state to INTIME
				KTObject._currTimeState = INTIME;
			}
			else if (KTObject._currTimeState === INTIME && isNaN(tempT)) {
				KTObject._currTimeState = POSTTIME;
			}

			//Only change if we are INTIME
			if (KTObject._currTimeState === INTIME) {
				KTObject._time.val = tempT;
			}
		};

		KTObject.draw = function() {
			//TODO Implement
			//Basically generate all the transforms
			if (KTObject._currTimeState === POSTTIME || KTObject._currTimeState === PRETIME) {
				KTObject.elem.style.display = 'none';
			}
			else {
				KTObject.elem.style.display = 'block';
			}

			generateTransforms(KTObject);
		};

		KTObject.getCurrTimeState = function() {
			return KTObject._currTimeState;
		};


		//=== Object Init ===
		KTObject._name = name;
		KTObject._delay.val = delay || 0;
		KTObject._duration.val = duration || Number.POSITIVE_INFINITY;

		return KTObject;
	}

	return constructor;
});