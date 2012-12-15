define(['engine/timeline'],
function(Timeline) {
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


		function KTEngine() {};

		//Add a sequence to the animation queue
		KTEngine.addSequence = function(seq) {

		}

		return KTEngine;
	}

	return constructor;
});