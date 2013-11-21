var expect = require('chai').expect;
var merle = require('./index.js');

describe('walking objects', function(){

	function expectProperties(o, arr){
		var propertyNames = [];
		merle(o, function(){
			if (this.isRoot) return;
			propertyNames.push(this.name);
		});

		expect(propertyNames).to.be.of.length(arr.length);
		expect(propertyNames).to.have.members(arr);
	};

	it('should walk all own properties', function(){
		var o = {};
		o.o1 = {};
		o.o2 = {};

		expectProperties(o, ['o1', 'o2']);
	});

	it('should walk all own properties even when nested', function(){
		var o = {};
		o.o1 = {};
		o.o2 = {};
		o.o2.test = function(){};

		expectProperties(o, ['o1', 'o2', 'test']);
	});

	it('should walk all inherited properties', function(){
		var o = {};
		o.o1 = {};
		o = Object.create(o);

		expectProperties(o, ['o1']);
	});


	it('should not reflect any nesting', function(){
		var o = { propertyName1: {p:4} };

		expectProperties(o, ['propertyName1', 'p']);
	});

	it('should walk the root', function(){
		var o = { }, found = false;

		merle(o, function(){
			found = true;
			expect(this.isRoot).to.be.true;
		});

		expect(found).to.be.true;
	});
});

describe('walking arrays', function(){
	it('should walk a simple array', function(){
		merle([1], function(){
			if (this.isRoot) return;
			expect(this.value).to.be.equal(1);
		});
	});
	it('should be able to replace a value in a simple array', function(){
		var arr = [1, 2, 3];

		merle(arr, function(){
			if (this.value === 2){
				this.value = 6;
			}
		});

		expect(arr).to.eql([1, 6, 3]);
	});
});

describe('stop walking', function(){
	it('should not walk children if false is returned', function(){
		var o = {
			stopHere: {
				propertyA: 6
			}
		};

		merle(o, function(){
			if (this.name === 'stopHere') return false;

			expect(this.name).to.not.be.equal('propertyA');
		});
	});
});
describe('value property', function(){
	it('should set this.value', function(){
		var o = { propertyName1: 4 }, found;

		merle(o, function(){
			if (!this.isRoot){
				found = true;
				expect(this.value).to.be.equal(4);
			}
		});

		expect(found).to.be.true;
	});
});
describe('name property', function(){
	it('should be set to the property name', function(){
		var o = { propertyName1: 4 }, found = false;

		merle(o, function(){
			if (this.isRoot) return;
			found = true;
			expect(this.name).to.be.equal('propertyName1');
		});

		expect(found).to.be.true;
	});
});

describe('roots and leaves', function(){
	it('should have isRoot and isLeaf properties', function(){
		var o = {
			propertyName1: {
				propertyA: 6
			}
		};

		merle(o, function(){
			if (this.name === 'propertyName1'){
				expect(this.isRoot).to.be.false;
				expect(this.isLeaf).to.be.false;
			} else if (this.name === 'propertyA'){
				expect(this.isRoot).to.be.false;
				expect(this.isLeaf).to.be.true;
			}
			else if (!this.isRoot){
				expect(false).to.be.true;
			}

		});
	});
});

describe('isOwn property', function(){
	it('should be set to the property name', function(){
		var o = { propertyName1: 4 };
		o = Object.create(o);
		o.propertyName2 = 6;


		merle(o, function(){
			if (this.name === 'propertyName1'){
				expect(this.isOwn).to.be.false;
			}
			if (this.name === 'propertyName2'){
				expect(this.isOwn).to.be.true;
			}
		});
	});
});

describe('depth property', function(){
	it('should start at zero', function(){
		var o = { }, found = false;

		merle(o, function(){
			found = true;
			expect(this.depth).to.be.equal(0);
		});

		expect(found).to.be.true;
	});

	it('should be 1 one level deep', function(){
		var zero = { one: {two:6} };

		var found = false;
		merle(zero, function(){
			if (this.name === 'one'){
				found = true;
				expect(this.depth).to.be.equal(1);
			}
		});

		expect(found).to.be.true;
	});
	it('should be 2 two levels deep', function(){
		var zero = { one: {two:{three:6}} };

		var found = false;
		merle(zero, function(){
			if (this.name === 'three'){
				found = true;
				expect(this.depth).to.be.equal(3);
			}
		});

		expect(found).to.be.true;
	});
	it('should be 2 two levels deep even when there are siblings', function(){
		var zero = { 
			propertyDontCare: 9000,
			one: {two:{three:6}},
			propertyName2:{ test:1}
		};

		var found = false;
		merle(zero, function(){
			if (this.name === 'three'){
				found = true;
				expect(this.depth).to.be.equal(3);
			}
		});

		expect(found).to.be.true;
	});
});
describe('path property', function(){
	it('should be an array of parent property names', function(){
		var o = {
			p: {
				q: {
					r: {
						s:666
					},
					w: 777
				}
			}
		};
	
		var found666 = false, found777 = false;
		merle(o, function(){
		
			if (this.value === 666){
				found666 = true;
				expect(this.path).to.eql(['p', 'q', 'r', 's']);
			}

			if (this.value === 777){
				found777 = true;
				expect(this.path).to.eql(['p', 'q', 'w']);
			}
		});

		expect(found777).to.be.true;
		expect(found666).to.be.true;
	});
});

describe('transform negative numbers in-place', function(){
	it('should work for substack\'s example', function(){
		var obj = [ 5, 6, -3, [ 7, 8, -2, 1 ], { f : 10, g : -13 } ];

		merle(obj, function(){
			if (this.value < 0) this.value += 128;
		});

		expect(obj).to.eql([ 5, 6, 125, [ 7, 8, 126, 1 ], { f: 10, g: 115 } ]);
	});
});
