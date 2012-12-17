define([],
function() {
	function constructor(targetObj, duration, lowBound, highBound, repeat) {
		if (repeat === undefined) {
			repeat = true;
		}
		function ChangeConstraint(usedBy) {
			var t = targetObj.timeAttr.useVal(usedBy) % duration;
			if (!repeat) {
				if (targetObj.timeAttr.useVal(usedBy) > duration)
					return highBound;
			}
			return ((t / duration) * (highBound - lowBound)) + lowBound;
		}

		return ChangeConstraint;
	}

	return constructor;
});