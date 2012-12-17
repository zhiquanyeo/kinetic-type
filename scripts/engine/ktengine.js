define(['engine/timeline', 'engine/constants'],
function(Timeline, Constants) {
	function constructor(canvas) {
		if (!canvas) {
			throw new Error('Animation canvas must be specified');
		}
		/*
		The KTEngine provides an interface for loading and running KT animations. 
		The KTEngine object handles the loading and display of all animation sequences
		and provides a sequence queue to support dynamically added animations.
		*/

		/**** Private Variables ****/
		//canvas
		var _canvas = canvas;

		//Timeline handling wall clock time
		var _timeline = new Timeline();

		//Sequence queue. Can dynamically add/remove sequences from here.
		//Once a sequence is complete, it is automatically removed from the queue
		var _sequenceQueue = [];

		//Currently playing sequence in the queue
		var _currentSequence = null;

		//Array of previously played sequences
		var _previousSequences = [];

		//Flag indicating if the engine is running
		var _isRunning = false;


		function KTEngine() {}

		//Add a sequence to the animation queue
		KTEngine.addSequence = function(seq) {
			seq.setCanvas(_canvas);
			seq.visible = false;
			_sequenceQueue.push(seq);

			//TODO dispatch event
		};

		KTEngine.removeSequence = function(seq) {
			for (var i = 0; i < _sequenceQueue.length; i++) {
				if (_sequenceQueue[i] === seq) {
					_sequenceQueue.splice(i, 1);
					break;
				}
			}
		};

		//PRIVATE: Get the next sequence from the queue
		function getNextSequence() {
			if (_sequenceQueue.length > 0) {
				var tempSeqArray = [];
				tempSeqArray = _sequenceQueue.splice(0, 1);
				return tempSeqArray[0];
			}
		}

		KTEngine.start = function() {
			if (_isRunning)
				return;

			_isRunning = true;

			_currentSequence = getNextSequence();
			if (!_currentSequence)
				return;

			//TODO dispatch event
			_currentSequence.setVisible(true);
			_timeline.clip(_currentSequence.duration);
			_timeline.start(new Date().getTime()); //<-- We need to pass in the current time
			
			render();
		};

		KTEngine.stop = function() {
			if (!_isRunning)
				return;

			_isRunning = false;

			//TODO Dispatch event
			_timeline.clip(0);
		};

		KTEngine.reset = function() {
			_sequenceQueue.length = 0;
			_sequenceQueue.concat(_previousSequences);
			_previousSequences.length = 0;
			KTEngine.stop();
			KTEngine.start();
		};

		KTEngine.pause = function() {
			if (!_isRunning)
				return;

			_isRunning = false;
			//TODO dispatch event
			_timeline.pause();
		};

		KTEngine.resume = function() {
			if (_isRunning)
				return;

			_isRunning = true;

			//TODO Dispatch event

			_timeline.resume();

			render();
		};

		function render(currTime) {
			if (!_isRunning)
				return;

			if (!_currentSequence)
				return;

			webkitRequestAnimationFrame(render);

			_currentSequence.update(_timeline);
			_currentSequence.draw();

			if (_currentSequence.getCurrTimeState() === Constants.timeState.POSTTIME) {
				_timeline = new Timeline();

				//push back onto previous sequences
				_previousSequences.push(_currentSequence);

				_currentSequence = getNextSequence();

				if (!_currentSequence) {
					//TODO dispatch event for ANIMATION_COMPLETE
					return;
				}

				_currentSequence.visible = true;
				_timeline.clip(_currentSequence.duration);
				_timeline.start(new Date().getTime());

				_currentSequence.update(_timeline);
				_currentSequence.draw();
			}
		}

		function getTotalDuration() {
			var totalDur = 0;
			for (var i = 0; i < _sequenceQueue.length; i++) {
				totalDur += _sequenceQueue[i].duration;
			}
			return totalDur;
		}

		return KTEngine;
	}

	return constructor;
});