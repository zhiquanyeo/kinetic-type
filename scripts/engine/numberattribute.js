define(['engine/ktattribute'],
function(KTAttribute) {
	function constructor(initialVal, initialCompositor, lowBound, highBound) {
		var retObj = new KTAttribute(initialVal, initialCompositor);

		retObj._lowerBound = lowBound || 0;
		retObj._upperBound = highBound || Number.POSITIVE_INFINITY;

		Object.defineProperty(retObj, 'lowerBound', {
			get: function() {
				return retObj._lowerBound;
			},
			set: function(val) {
				retObj._lowerBound = val;
			}
		});

		Object.defineProperty(retObj, 'upperBound', {
			get: function() {
				return retObj._upperBound;
			},
			set: function(val) {
				retObj._upperBound = val;
			}
		});

		Object.defineProperty(retObj, 'numberVal', {
			get: function() {
				return retObj.useVal(null);
			},
			set: function(newVal) {
				if (newVal < retObj._lowerBound)
					retObj.val = retObj._lowerBound;
				else if (newVal > retObj._upperBound)
					retObj.val = retObj._upperBound;
				else
					retObj.val = newVal;
			}
		});

		Object.defineProperty(retObj, 'rawNumberVal', {
			get: function() {
				return retObj.rawVal;
			},
			set: function(newVal) {
				if (newVal < retObj._lowerBound)
					retObj.rawVal = retObj._lowerBound;
				else if (newVal > retObj._upperBound)
					retObj.rawVal = retObj._upperBound;
				else
					retObj.rawVal = newVal;
			}
		});

		retObj.useNumberVal = function(usingObj) {
			return retObj.useVal(usingObj);
		};

		retObj.modNumberVal = function() {
			return retObj.modVal();
		};

		return retObj;
	}
	return constructor;
});