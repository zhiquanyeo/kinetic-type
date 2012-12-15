define(['engine/kineticobject'], 
function(KTObject) {
	function constructor(name, delay, duration) {
		
		var _children = [];

		function KTSequence() {};

		KTSequence.prototype = new KTObject(name, delay, duration);

		KTSequence.addChild = function(child) {
			_children.push(child);
		}

		KTSequence.removeChildAtIndex = function(idx) {
			_children.splice(idx, 1);
		}

		KTSequence.removeAllChildren = function() {
			_chlidren.length = 0;
		}

		KTSequence.numChildren = function() {
			return _children.length;
		}

		KTSequence.getChildAt = function(idx) {
			return _children[idx];
		}

		KTSequence.update = function(timeline) {
			var tempT = timeline.getTime();

			if (KTSequence.currTimeState === KTSequence.enums.timeState.PRETIME && !isNaN(tempT)) {
				KTSequence.currTimeState = KTSequence.enums.timeState.INTIME;
			}
			else if (KTSequence.currTimeState === INTIME && isNaN(tempT)) {
				KTSequence.currTimeState = KTSequence.enums.timeState.POSTTIME;
			}

			if (KTSequence.currTimeState === KTSequence.enums.timeState.INTIME) {
				KTSequence.time = tempT;
			}

			for (var i = 0; i < _children.length; i++) {
				var newT = timeline.clone();
				newT.translate(_children[i].delay);
				newT.clip(_children[i].duration);
				_children[i].update(newT);
				newT = undefined;
			}
		}

		KTSequence.draw = function() {
			for (var i = 0; i < _children.length; i++) {
				_children[i].draw();
			}
		}

		Object.defineProperty(KTSequence, 'visible', {
			set: function(val) {
				for (var i = 0; i < _children.length; i++) {
					_children[i].visible = val;
				}
			}
		});

		KTSequence.calculateDuration = function() {
			var totalDur = 0;
			var prevTotalDur = 0;

			for (var i = 0; i < _children.length; i++) {
				if (_children[i].calculateDuration) {
					_children[i].calculateDuration();
				}
				totalDur += _children[i].duration - (totalDur - _children[i].delay);
				if (totalDur < prevTotalDur)
					totalDur = prevTotalDur;
				prevTotalDur = totalDur;
			}

			KTSequence.duration = totalDur;
		}

		return KTSequence;
	}

	return constructor;
});