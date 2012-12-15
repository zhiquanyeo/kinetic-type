describe('KTObject', function() {
	beforeEach(function() {
		var that = this;
		var flag = false;
		require(['engine/kineticobject'], function(KTObject) {
			that.ktObject1 = new KTObject('TestObject',0,5);
			that.ktObject2 = new KTObject('TestObject2', 0, 5);
			flag = true;
		});

		waitsFor(function() {
			return flag;
		});
	});

	describe('Basic Behavior', function() {
		it('should report its name correctly', function() {
			expect(this.ktObject1.getName()).toBe('TestObject');
		});

		it('should report its delay correctly', function() {
			expect(this.ktObject1.delay).toBe(0);
		});

		it('should report its duration correctly', function() {
			expect(this.ktObject1.duration).toBe(5);
		});

		it('should reflect changes to its values', function() {
			this.ktObject1.visible = true;
			this.ktObject1.x = 100;
			this.ktObject1.y = 100;

			expect(this.ktObject1.visible).toEqual(true);
			expect(this.ktObject1.x).toBe(100);
			expect(this.ktObject1.y).toBe(100);
		});
	});

	describe('Properties', function() {
		it('should generate the correct translate3d string when modifying x and y', function() {
			this.ktObject1.x = 100;
			this.ktObject1.y = 200;
			expect(this.ktObject1.elem.style.webkitTransform).toMatch(/translate3d\(100px, 200px, 0px\)/);
		});

		it('should generate the correct rotate3d string when modifying rotation', function() {
			this.ktObject1.rotation = 45;
			expect(this.ktObject1.elem.style.webkitTransform).toMatch(/rotate3d\(0, 0, 1, 45deg\)/);
		});

		it('should generate the correct scale3d string when modifying scale', function() {
			this.ktObject1.scale = 5;
			expect(this.ktObject1.elem.style.webkitTransform).toMatch(/scale3d\(5, 5, 1\)/);

			this.ktObject1.scaleX = 2;
			this.ktObject1.scaleY = 8;
			expect(this.ktObject1.elem.style.webkitTransform).toMatch(/scale3d\(2, 8, 1\)/);
		});
	});

	describe('Constraints', function() {
		it('should return the correct values based on constraints', function() {
			var ktObject1 = this.ktObject1;
			var ktObject2 = this.ktObject2;

			function linearConstraint(usedBy) {
				return ktObject2.xAttr.useVal(usedBy) + 10;
			}

			ktObject1.xAttr.addConstraint(linearConstraint);
			ktObject2.x = 10;

			expect(this.ktObject1.x).toBe(20);
		});
	});
});