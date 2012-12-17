define(['engine/kineticobject', 'engine/numberattribute'],
function(KTObject, NumberAttribute) {
	function constructor(name, displayString, textFormat, delay, duration) {
		
		var KTText = new KTObject(name, delay, duration);

		KTText.elem.innerText = displayString;

		KTText._red = new NumberAttribute(0);
		KTText._green = new NumberAttribute(0);
		KTText._blue = new NumberAttribute(0);
		KTText._alpha = new NumberAttribute(1, null, 0, 1);

		function generateColor() {
			var colorString = 'rgba(' + KTText._red.val + ', ' + KTText._green.val +
							', ' + KTText._blue.val + ', ' + KTText._alpha.val + ')';
			KTText.elem.style.color = colorString;
		}


		Object.defineProperty(KTText, "text", {
			get: function () {
				return KTText.elem.innerText;
			},
			set: function(val) {
				KTText.elem.innerText = val;
			}
		});

		Object.defineProperty(KTText, "fontSize", {
			get: function() {
				return parseFloat(KTText.elem.style.fontSize);
			},
			set: function(val) {
				KTText.elem.style.fontSize = val + 'px';
			}
		});

		Object.defineProperty(KTText, 'red', {
			get: function() {
				return KTText._red.val;
			},
			set: function(val) {
				KTText._red.val = val;
				generateColor();
			}
		});

		Object.defineProperty(KTText, 'redAttr', {
			get: function() {
				return KTText._red;
			}
		});

		Object.defineProperty(KTText, 'green', {
			get: function() {
				return KTText._green.val;
			},
			set: function(val) {
				KTText._green.val = val;
				generateColor();
			}
		});

		Object.defineProperty(KTText, 'greenAttr', {
			get: function() {
				return KTText._green;
			}
		});

		Object.defineProperty(KTText, 'blue', {
			get: function() {
				return KTText._blue.val;
			},
			set: function(val) {
				KTText._blue.val = val;
				generateColor();
			}
		});

		Object.defineProperty(KTText, 'blueAttr', {
			get: function() {
				return KTText._blue;
			}
		});

		Object.defineProperty(KTText, 'alpha', {
			get: function() {
				return KTText._alpha.val;
			},
			set: function(val) {
				KTText._alpha.val = val;
				generateColor();
			}
		});

		Object.defineProperty(KTText, 'alphaAttr', {
			get: function() {
				return KTText._alpha;
			}
		});

		var superDraw = KTText.draw;
		KTText.draw = function() {
			superDraw();
			generateColor();
		};

		return KTText;
	}

	return constructor;
});