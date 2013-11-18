var merle = require('./index.js');
var expect = require('chai').expect;

exports.expectProperties = function(o, arr){
	var propertyNames = [];
	merle(o, function(){
		propertyNames.push(this.name);
	});

	expect(propertyNames).to.be.of.length(arr.length);
	expect(propertyNames).to.have.members(arr);
};
