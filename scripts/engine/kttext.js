define(['engine/kineticobject'],
function(KineticObject) {
	function constructor() {
		var retObj = new KineticObject();

		Object.defineProperty(retObj, "text", {
			get: function () {
				return retObj.elem.innerText;
			},
			set: function(val) {
				retObj.elem.innerText = val;
			}
		});

		Object.defineProperty(retObj, "fontSize", {
			get: function() {
				return parseFloat(retObj.elem.style.fontSize);
			},
			set: function(val) {
				retObj.elem.style.fontSize = val + 'px';
			}
		})

		return retObj;
	}

	return constructor;
});