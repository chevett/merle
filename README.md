merle [![Build Status](https://travis-ci.org/chevett/merle.png?branch=master)](https://travis-ci.org/chevett/merle?branch=master)
=====

poor man's [traverse](https://github.com/substack/js-traverse), except merle includes inherited properties.

![get it](http://media.moddb.com/cache/images/groups/1/6/5169/thumb_620x2000/Merle_Dixon_-_The_Walking_Dead_-_Guts34.jpg)


examples
-------
    var merle = require('merle');
    
    merle(someObject, function(){
    
      console.log(this.name); 
      console.log(this.value);
      console.log(this.depth);
      console.log(this.path); // the array of property names that got us to this node.
      console.log(this.isLeaf);
      console.log(this.isRoot);
      console.log(this.isOwn);
      
      this.value = 'this replaces the current node';
      
      return false; // return an explicit false is equivalent to calling this.stop(); 
      
	  // this.stop() will stop walking the current path, this.stop(true) will stop completely
    });

### transform negative numbers in-place

	var merle = require('merle');
	var obj = [ 5, 6, -3, [ 7, 8, -2, 1 ], { f : 10, g : -13 } ];
	
	merle(obj, function () {
	    if (this.value < 0) this.value += 128;
	});
	
	console.dir(obj);


Output:

    [ 5, 6, 125, [ 7, 8, 126, 1 ], { f: 10, g: 115 } ]
    
### delete negative numbers in-place

	var merle = require('merle');
	var obj = [ 5, 6, -3, [ 7, 8, -2, 1 ], { f : 10, g : -13 } ];
	
	merle(obj, function () {
	    if (this.value < 0) delete this.value;
	});
	
	console.dir(obj);


Output:

    [ 5, 6, [ 7, 8, 1 ], { f: 10 } ]
