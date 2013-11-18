var expect = require('chai').expect;
var merle = require('./index.js');

describe('merle', function(){
	it('should walk all own properties', function(){
		var o = Object.create(null);
		o.o1 = {};
		o.o2 = {};

		var propertyNames = [];
		merle(o, function(){
			propertyNames.push(this.name);
		});

		expect(propertyNames).to.be.of.length(2);
		expect(propertyNames).to.have.members(['o1', 'o2']);
	});

	it('should walk all own properties even when nested', function(){
		var o = Object.create(null);
		o.o1 = {};
		o.o2 = {};
		o.o2.test = function(){};

		var propertyNames = [];
		merle(o, function(){
			propertyNames.push(this.name);
		});

		expect(propertyNames).to.be.of.length(3);
		expect(propertyNames).to.have.members(['o1', 'o2', 'test']);
	});

	it('should walk all own properties', function(){
		var o = Object.create(null);
		o.o1 = {};
		o = Object.create(o);	

		var propertyNames = [];
		merle(o, function(){
			propertyNames.push(this.name);
		});

		expect(propertyNames).to.be.of.length(1);
		expect(propertyNames).to.have.members(['o1']);
	});
});
