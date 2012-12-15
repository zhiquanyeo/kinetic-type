define([],
function() {
	/**
	ConstraintContainer holds a constraint and weightage
	*/
	function constructor(constraint, weight) {

		var _constraint = constraint;
		var _weight = weight || 1;

		function retObj() {}

		Object.defineProperty(retObj, 'constraint', {
			get: function() {
				return _constraint;
			},
			set: function(newConstraint) {
				_constraint = newConstraint;
			}
		});

		Object.defineProperty(retObj, 'weight', {
			get: function() {
				return _weight;
			},
			set: function(newWeight) {
				_weight = newWeight;
			}
		});

		return retObj;
	}

	return constructor;
});