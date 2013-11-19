var expect = require('chai').expect;
var merle = require('./index.js');
var util = require('./test-util');

describe('walking objects', function(){
	it('should walk all own properties', function(){
		var o = {};
		o.o1 = {};
		o.o2 = {};

		util.expectProperties(o, ['o1', 'o2']);
	});

	it('should walk all own properties even when nested', function(){
		var o = {};
		o.o1 = {};
		o.o2 = {};
		o.o2.test = function(){};

		util.expectProperties(o, ['o1', 'o2', 'test']);
	});

	it('should walk all inherited properties', function(){
		var o = {};
		o.o1 = {};
		o = Object.create(o);

		util.expectProperties(o, ['o1']);
	});

	it('should pass the property value as the only parameter', function(){
		var o = { propertyName1: 4 };

		merle(o, function(p){
			expect(p).to.be.equal(4);
		});
	});

	it('should not reflect any nesting', function(){
		var o = { propertyName1: {p:4} };

		util.expectProperties(o, ['propertyName1', 'p']);
	});

});

describe('walking arrays', function(){
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
describe('name property', function(){
	it('should be set to the property name', function(){
		var o = { propertyName1: 4 };

		merle(o, function(){
			expect(this.name).to.be.equal('propertyName1');
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
		var o = { propertyName1: 4 };

		merle(o, function(){
			expect(this.depth).to.be.equal(0);
		});
	});
	it('should be 1 one level deep', function(){
		var o = { propertyName1: {two:6} };

		var found = false;
		merle(o, function(){
			if (this.name === 'two'){
				found = true;
				expect(this.depth).to.be.equal(1);
			}
		});

		expect(found).to.be.true;
	});
	it('should be 2 two levels deep', function(){
		var o = { propertyName1: {two:{three:6}} };

		var found = false;
		merle(o, function(){
			if (this.name === 'three'){
				found = true;
				expect(this.depth).to.be.equal(2);
			}
		});

		expect(found).to.be.true;
	});
	it('should be 2 two levels deep even when there are siblings', function(){
		var o = { 
			propertyName1: {two:{three:6}},
			propertyName2:{ test:1}
		};

		var found = false;
		merle(o, function(){
			if (this.name === 'three'){
				found = true;
				expect(this.depth).to.be.equal(2);
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
		merle(o, function(p){
		
			if (p === 666){
				found666 = true;
				expect(this.path).to.have.length(4);
				expect(this.path[0]).to.be.equal('p');
				expect(this.path[1]).to.be.equal('q');
				expect(this.path[2]).to.be.equal('r');
				expect(this.path[3]).to.be.equal('s');
			}

			if (p === 777){
				found777 = true;
				expect(this.path).to.have.length(3);
				expect(this.path[0]).to.be.equal('p');
				expect(this.path[1]).to.be.equal('q');
				expect(this.path[2]).to.be.equal('w');
			}
		});

		expect(found777).to.be.true;
		expect(found666).to.be.true;
	});
});
