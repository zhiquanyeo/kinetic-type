describe('Timeline', function() {
	beforeEach(function() {
		var that = this;
		var flag = false;
		require(['engine/timeline'], function(Timeline) {
			that.timeline1 = new Timeline();
			that.timeline1.setPauseTime(1234);
			that.timeline1.setGlobalTime(4321);
			flag = true;
		});

		waitsFor(function() {
			return flag;
		});
	});

	describe('Basic Coherence', function() {
		it('should have the same values as it\'s clone', function(){
			var timeline2 = this.timeline1.clone();
			expect(JSON.stringify(this.timeline1._dbgDataDump()) === JSON.stringify(timeline2._dbgDataDump())).toEqual(true);
		});

		it('should maintain separation between different instances', function() {
			var timeline2 = this.timeline1.clone();
			this.timeline1.setClipDuration(2222);
			expect(JSON.stringify(this.timeline1._dbgDataDump()) === JSON.stringify(timeline2._dbgDataDump())).toEqual(false);
		});
	});
});