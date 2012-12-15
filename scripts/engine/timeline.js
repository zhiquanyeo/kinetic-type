define([],
function() {
	function constructor() {

		/***** Internals *****/
		//Current wall clock (elapsed) time
		var _globalTime = 0;

		//System time at which we started this timeline
		var _sysStartTime = 0;

		//Offset from global time (delay)
		var _timeOffset = 0;

		//Time at which the timeline was paused
		var _pauseTime = 0;

		//Flag indicating that the animation is paused
		var _isPaused = false;

		//Amount of time to shift by to compensate for pauses
		var _pauseOffset = 0;

		//Clipping region for time. Otherwise, getTime() will return NaN once clipDuration is reached
		var _clipDuration = Number.POSITIVE_INFINITY;

		//Overall clip duration for time. This is the top level clipping value
		//and once the global time goes over the clipping value, time stops
		var _globalClipDuration = Number.POSITIVE_INFINITY;


		function retObj() {};

		//Translate a timeline. Shifts the 0 second mark <timeShift> ms into the future
		retObj.translate = function(timeShift) {
			if (_timeOffset + timeShift > 0) {
				_timeOffset += timeShift;
			}
			else {
				_timeOffset = 0;
			}
		}

		//Set clipping times
		//Set up a clipping region on this timeline. A clipping region defines when an object gets calid time values
		//E.g. If an object is set up to run for 50s, but a clipping region of 30s is set, then the object
		//will only run for 30s
		retObj.clip = function(timeClip) {
			_clipDuration = timeClip;
			if (_timeOffset + timeClip < _globalClipDuration) {
				_globalClipDuration = _timeOffset + timeClip;
			}
		}

		retObj.getClip = function() {
			return _clipDuration;
		}

		retObj.getTime = function(sysTime) {
			retObj.update(sysTime);

			if (_globalTime - _timeOffset < 0)
				return Number.NaN;
			else if (_globalTime > _globalClipDuration)
				return Number.NaN;
			else
				return _globalTime - _timeOffset;
			
		}

		retObj.update = function(sysTime) {
			if (_isPaused) {
				_globalTime = _pauseTime - _sysStartTime - _pauseOffset;
			}
			else {
				_globalTime = sysTime - _sysStartTime - _pauseOffset;
			}
		}

		retObj.start = function(startTime) {
			_sysStartTime = startTime;
		}

		retObj.pause = function(pauseTime) {
			_isPaused = true;
			_pauseTime = pauseTime;
		}

		retObj.resume = function(resumeTime) {
			_isPaused = false;
			_pauseOffset += (resumeTime - _pauseTime);
		}

		retObj.getGlobalTime = function() {
			return _globalTime;
		}

		retObj.clone = function() {
			var copy = new constructor();
			copy.setGlobalTime(_globalTime);
			copy.setClipDuration(_clipDuration);
			copy.setGlobalClipDuration(_globalClipDuration);
			copy.setSysStartTime(_sysStartTime);
			copy.setTimeOffset(_timeOffset);
			copy.setPauseTime(_pauseTime);
			copy.setIsPaused(_isPaused);
			copy.setPauseOffset(_pauseOffset);
			return copy;
		}

		//setting features
		retObj.setPauseTime = function(pT) {
			_pauseTime = pT;
		}

		retObj.setIsPaused = function(iP) {
			_isPaused = iP;
		}

		retObj.setPauseOffset = function(pO) {
			_pauseOffset = pO;
		}

		retObj.setGlobalTime = function(gT) {
			_globalTime = gT;
		}

		retObj.setSysStartTime = function(sT) {
			_sysStartTime = sT;
		}

		retObj.setTimeOffset = function(tO) {
			_timeOffset = tO;
		}

		retObj.setClipDuration = function(cD) {
			_clipDuration = cD;
		}

		retObj.setGlobalClipDuration = function(gCD) {
			_globalClipDuration = gCD;
		}

		retObj.getSysStartTime = function() {
			return _sysStartTime;
		}

		//DEBUG ONLY
		retObj._dbgDataDump = function() {
			return {
				pauseTime: _pauseTime,
				isPaused: _isPaused,
				pauseOffset: _pauseOffset,
				globalTime: _globalTime,
				sysStartTime: _sysStartTime,
				timeOffset: _timeOffset,
				clipDuration: _clipDuration,
				globalClipDuration: _globalClipDuration,
			};
		}

		return retObj;
	};

	return constructor;
});