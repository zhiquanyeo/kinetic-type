describe('ConstraintContainer', function() {

	beforeEach(function() {
		var that = this;
		var flag = false;
		require(['engine/constraintcontainer'], function (ConstraintContainer) {
			function testFunc1() {
				return 'testFunc1';
			}
			function testFunc2() {
				return 'testFunc2';
			}
			that.container1 = new ConstraintContainer(testFunc1, 1);
			that.container2 = new ConstraintContainer(testFunc2, 2);

			flag = true;
		});

		waitsFor(function() {
			return flag;
		})
	});

	describe('Appropriate Behavior', function() {
		it('should return the function it was initialized with', function() {
			expect((this.container1.constraint)() === 'testFunc1').toEqual(true);
		});

		it('should return the weight it was initialized with', function() {
			expect((this.container2.weight) === 2).toEqual(true);
		});
	})
})