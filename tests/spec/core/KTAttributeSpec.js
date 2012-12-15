describe('KTAttribute', function() {
	beforeEach(function() {
		var that = this;
		var flag = false;
		require(['engine/ktattribute'], function (KTAttribute) {
			that.attribute1 = new KTAttribute(0);
			that.attribute2 = new KTAttribute(0);
			that.attribute3 = new KTAttribute(0);
			flag = true;
		});

		waitsFor(function() {
			return flag;
		});
	});

	describe('Constraints', function() {
		it('should update its value accordingly, following a constraint', function() {
			var attr1 = this.attribute1;
			var attr2 = this.attribute2;

			function constraint(usedBy) {
				return attr2.useVal(usedBy) + 10;
			}

			attr1.addConstraint(constraint);
			attr2.val = 10;

			expect(attr2.val).toBe(10);
			expect(attr1.val).toBe(20);
		});

		it('should behave correctly when constraints are chained together', function() {
			function constraint(targetAttribute, value) {
				function c(usedBy) {
					return targetAttribute.useVal(usedBy) + value;
				}

				return c;
			}

			this.attribute2.addConstraint(new constraint(this.attribute1, 10));
			this.attribute3.addConstraint(new constraint(this.attribute2, 15));
			this.attribute1.val = 10;

			expect(this.attribute2.val).toBe(20);
			expect(this.attribute3.val).toBe(35);
		});
	});
});