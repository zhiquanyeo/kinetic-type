define([],
function() {
	function constructor() {

		function retObj() {

		}

		retObj.calculateValue = function(constraintArray, targetAttribute) {
			if (constraintArray.length == 0) {
				return targetAttribute.rawVal;
			}
			else {
				var constraint = (constraintArray[0]).getConstraint();
				return constraint(targetAttribute);
			}
		}

		return retObj;
	}

	return constructor;
});