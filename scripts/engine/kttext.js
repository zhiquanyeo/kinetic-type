define(['engine/kineticobject'],
function(KTObject) {
	function constructor(name, displayString, textFormat, delay, duration) {
		
		var KTText = new KTObject(name, delay, duration);

		KTText.elem.innerText = displayString;

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

		return KTText;
	}

	return constructor;
});