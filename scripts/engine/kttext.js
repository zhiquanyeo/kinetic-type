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

		return retObj;
	}

	return constructor;
});