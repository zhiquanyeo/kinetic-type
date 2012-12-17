define([],
function() {
	function constructor() {

		function FirstItemCompositor() {

		}

		FirstItemCompositor.calculateValue = function(constraintArray, targetAttribute) {
			if (constraintArray.length == 0) {
				return targetAttribute.rawVal;
			}
			else {
				var constraint = (constraintArray[0]).constraint;
				return constraint(targetAttribute);
			}
		};

		return FirstItemCompositor;
	}

	return constructor;
});