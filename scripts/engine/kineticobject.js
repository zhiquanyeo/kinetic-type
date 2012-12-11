define([],
function() {
	function constructor() {
		console.log('constructing');
		var that = this;

		var elem = document.createElement('div');
		elem.classList.add('kinetic');

		function retObj() {

		}

		retObj.addToCanvas = function (canvas) {
			canvas.appendChild(elem);
		}

		//Property Definitions
		Object.defineProperty(retObj, "x", {
			get: function() {
				return (elem.style.left) ? parseInt(elem.style.left) : 0;
			},
			set: function(val) {
				elem.style.left = parseInt(val) + 'px';
			}
		});

		Object.defineProperty(retObj, "y", {
			get: function() {
				return (elem.style.top) ? parseInt(elem.style.top) : 0;
			},
			set: function(val) {
				elem.style.top = parseInt(val) + 'px';
			}
		});

		Object.defineProperty(retObj, "rotation", {
			get: function() {
				return elem._rotation;
			},
			set: function(val) {
				elem._rotation = val;
				elem.style.webkitTransform = 'rotate3d(0, 0, 1, ' + val + 'deg)';
			}
		})

		Object.defineProperty(retObj, "elem", {
			get: function() {
				return elem;
			},
			set: function(val) {
				elem = val;
			}
		});

		return retObj;
	}

	return constructor;
});