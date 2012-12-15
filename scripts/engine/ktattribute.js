define(['engine/compositor/firstitemcompositor', 'engine/constraintcontainer'],
function(FirstItemCompositor, ConstraintContainer) {
	/**
	 * The KTAttribute interface defines an API for values which can be controlled
	 * by constraints. Relationships can be established between KTAttribute objects
	 * such that the value of one is computer from the value of others. An attribute
	 * value is related to one or more other attribute values by a means of a 
	 * constraint equation. The constraint evaluation system will automatically
	 * maintain these declared relationships in the face of changes to the 
	 * system. As a result, once constraints are established, KTAttribute objects
	 * can normally just be assigned and retrieved and the system will automatically
	 * maintain the declared relationships behind the scenes
	 *
	 */

	function constructor(initialVal, initialCompositor) {
		var that = this;

		//Obj to be returned
		function retObj() {

		}

		//Helper functions
		/**
		 * (Re)compute the value of this object based on any attached constraint functions
		 * and leave the up to date value in _value
		 */
		function computeValue(attr) {
			attr.rawVal = attr._compositor.calculateValue(attr._constraintArray, attr);
			
		}

		function initializeValue(attr, initialVal) {
			attr.rawVal = initialVal;
		}

		function clearUsedBySet(attr) {
			attr._usedBySet.length = 0;
		}

		/**
		 * Adds objectUsingValue to the list of attributes using that value
		 */
		function addUsedBy(attr, objectUsingValue) {
			if (objectUsingValue !== undefined && objectUsingValue !== null) {
				attr._usedBySet.push(objectUsingValue);
			}
		}

		function clearFlag(attr, mask) {
			attr._flags &= ~mask;
		}

		function setFlag(attr, mask) {
			attr._flags |= mask;
		}

		function flagSet(attr, mask) {
			return (attr._flags & mask) != 0;
		}

		//Internal Constants
		var MARKED_OOD		= 1;
		var HAS_ACTION 		= 2;
		var INITIAL_FLAGS	= MARKED_OOD;
		retObj.MARKED_OOD 		= MARKED_OOD;
		retObj.HAS_ACTION 		= HAS_ACTION
		retObj.INITIAL_FLAGS	= MARKED_OOD;

		//Internal variables
		/** Value of this object */
		retObj._value = null;

		/** 
		 * Collection of bits used as binary flags. Used to describe state of
		 * the attribute. Constants provided, giving symbolic name for bit 
		 * positions
		 */
		 retObj._flags = retObj.INITIAL_FLAGS;

		 /**
		  * The set of attributes which currently use this attribute to compute their values
		  * KTAttribute objects are recorded in this collection when they are passed as params
		  * to useVal()
		  *
		  * This collection is maintained dynamically and is only valid when the value is
		  * up to date (isOOD() = false). When the value is out of date, this set is not 
		  * maintained, since out of date traversals cannot pass this value to notify dependants
		  *
		  * Specifically, this set is cleared when the value is marked OOD, and subsequently recreated
		  * based on requests for the value. This allows the set to reflect the actual dynamic
		  * dependencies that are currently in place
		  */
		retObj._usedBySet = [];

		/**
		 * Array of constraints
		 */
		retObj._constraintArray = [];

		/**
		 * Parent object which owns this attribute
		 */
		retObj._parent = null;

		/**
		 * The compositor object for this attribute
		 */
		retObj._compositor = null;


		/** Value of this attribute */
		Object.defineProperty(retObj, "val", {
			get: function() {
				return retObj.useVal(retObj, null);
			},
			set: function(newVal) {
				//Mark as up to date, so that traversal starts here
				clearFlag(retObj, MARKED_OOD);

				//Start OOD traversal
				retObj.markOOD(retObj);

				retObj.rawVal = newVal;

				//Used to break cycles
				clearFlag(retObj, MARKED_OOD);
			}
		});

		/**
		 * Computes then modifies the rawValue, then adds usingObj to the list
		 * of objects using this attribute
		 */

		Object.defineProperty(retObj, "rawVal", {
			get: function() {
				return retObj._value;
			},
			set: function(newVal) {
				retObj._value = newVal;
			}
		});

		Object.defineProperty(retObj, 'compositor', {
			get: function() {
				return retObj._compositor;
			},
			set: function(val) {
				retObj._compositor = val;
				retObj.markOOD(retObj);
			}
		});

		Object.defineProperty(retObj, 'parent', {
			get: function() {
				return retObj._parent;
			},
			set: function(val) {
				retObj._parent = val;
			}
		});

		Object.defineProperty(retObj, 'numConstraints', {
			get: function() {
				return retObj._constraintArray.length;
			}
		});

		Object.defineProperty(retObj, 'flags', {
			get: function() {
				return retObj._flags;
			}
		});

		//Public methods
		retObj.isOOD = function() {
			return flagSet(retObj, MARKED_OOD);
		};

		/**
		 * Mark dependents out of date if they are not already marked as such
		 */
		retObj.markOOD = function(fromObj) {
			//Only do stuff if we are not already marked as OOD (prevents cycles)
			if (!flagSet(retObj, MARKED_OOD)) {
				//Mark us as OOD, do this first to prevent cycles
				setFlag(retObj, MARKED_OOD);

				//Loop through all our dependents and mark them as OOD
				for (var i in retObj._usedBySet) {
					var dep = retObj._usedBySet[i];
					dep.markOOD(retObj);
				}

				clearUsedBySet(retObj);
			}
		};

		/**
		 * Adds a constraint of this attribute
		 */
		retObj.addConstraint = function(newConstraint) {
			retObj._constraintArray.push(new ConstraintContainer(newConstraint));
		};

		/**
		 * Mark this attribute as OOD
		 */
		retObj.modVal = function() {
			var result = retObj.val;
			retObj.markOOD(retObj);
			return result;
		};

		/**
		 * Computes and then modifies the raw value, then adds usingObj to the list
		 * of objects using this attribute.
		 */
		retObj.useVal = function(usingObj) {
			if (flagSet(retObj, MARKED_OOD)) {
				//Unmark OOD first so we can break cyclic dependencies
				clearFlag(retObj, MARKED_OOD);

				computeValue(retObj);
			}

			addUsedBy(retObj, usingObj);

			return retObj._value;
		}

		//==== Initialization code =====
		initializeValue(retObj, initialVal);

		if (!initialCompositor) {
			retObj._compositor = new FirstItemCompositor();
		}

		return retObj;
	}

	return constructor;
});