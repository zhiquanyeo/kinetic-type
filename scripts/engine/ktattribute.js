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
		function KTAttribute() {

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
		KTAttribute.MARKED_OOD 		= MARKED_OOD;
		KTAttribute.HAS_ACTION 		= HAS_ACTION
		KTAttribute.INITIAL_FLAGS	= MARKED_OOD;

		//Internal variables
		/** Value of this object */
		KTAttribute._value = null;

		/** 
		 * Collection of bits used as binary flags. Used to describe state of
		 * the attribute. Constants provided, giving symbolic name for bit 
		 * positions
		 */
		 KTAttribute._flags = KTAttribute.INITIAL_FLAGS;

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
		KTAttribute._usedBySet = [];

		/**
		 * Array of constraints
		 */
		KTAttribute._constraintArray = [];
		
		/**
		 * Parent object which owns this attribute
		 */
		KTAttribute._parent = null;

		/**
		 * The compositor object for this attribute
		 */
		KTAttribute._compositor = null;


		/** Value of this attribute */
		Object.defineProperty(KTAttribute, "val", {
			get: function() {
				return KTAttribute.useVal(KTAttribute, null);
			},
			set: function(newVal) {
				//Mark as up to date, so that traversal starts here
				clearFlag(KTAttribute, MARKED_OOD);

				//Start OOD traversal
				KTAttribute.markOOD(KTAttribute);

				KTAttribute.rawVal = newVal;

				//Used to break cycles
				clearFlag(KTAttribute, MARKED_OOD);
			}
		});

		/**
		 * Computes then modifies the rawValue, then adds usingObj to the list
		 * of objects using this attribute
		 */

		Object.defineProperty(KTAttribute, "rawVal", {
			get: function() {
				return KTAttribute._value;
			},
			set: function(newVal) {
				KTAttribute._value = newVal;
			}
		});

		Object.defineProperty(KTAttribute, 'compositor', {
			get: function() {
				return KTAttribute._compositor;
			},
			set: function(val) {
				KTAttribute._compositor = val;
				KTAttribute.markOOD(KTAttribute);
			}
		});

		Object.defineProperty(KTAttribute, 'parent', {
			get: function() {
				return KTAttribute._parent;
			},
			set: function(val) {
				KTAttribute._parent = val;
			}
		});

		Object.defineProperty(KTAttribute, 'numConstraints', {
			get: function() {
				return KTAttribute._constraintArray.length;
			}
		});

		Object.defineProperty(KTAttribute, 'flags', {
			get: function() {
				return KTAttribute._flags;
			}
		});

		//Public methods
		KTAttribute.isOOD = function() {
			return flagSet(KTAttribute, MARKED_OOD);
		};

		/**
		 * Mark dependents out of date if they are not already marked as such
		 */
		KTAttribute.markOOD = function(fromObj) {
			//Only do stuff if we are not already marked as OOD (prevents cycles)
			if (!flagSet(KTAttribute, MARKED_OOD)) {
				//Mark us as OOD, do this first to prevent cycles
				setFlag(KTAttribute, MARKED_OOD);

				//Loop through all our dependents and mark them as OOD
				for (var i in KTAttribute._usedBySet) {
					var dep = KTAttribute._usedBySet[i];
					dep.markOOD(KTAttribute);
				}

				clearUsedBySet(KTAttribute);
			}
		};

		/**
		 * Adds a constraint of this attribute
		 */
		KTAttribute.addConstraint = function(newConstraint) {
			KTAttribute._constraintArray.push(new ConstraintContainer(newConstraint));
			console.log('cosntraint added');
		};

		/**
		 * Mark this attribute as OOD
		 */
		KTAttribute.modVal = function() {
			var result = KTAttribute.val;
			KTAttribute.markOOD(KTAttribute);
			return result;
		};

		/**
		 * Computes and then modifies the raw value, then adds usingObj to the list
		 * of objects using this attribute.
		 */
		KTAttribute.useVal = function(usingObj) {
			if (flagSet(KTAttribute, MARKED_OOD)) {
				//Unmark OOD first so we can break cyclic dependencies
				clearFlag(KTAttribute, MARKED_OOD);

				computeValue(KTAttribute);
			}

			addUsedBy(KTAttribute, usingObj);

			return KTAttribute._value;
		};

		//==== Initialization code =====
		initializeValue(KTAttribute, initialVal);

		if (!initialCompositor) {
			KTAttribute._compositor = new FirstItemCompositor();
		}

		return KTAttribute;
	}

	return constructor;
});