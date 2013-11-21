merle [![Build Status](https://travis-ci.org/chevett/merle.png?branch=master)](https://travis-ci.org/chevett/merle?branch=master)
=====

poor man's [traverse](https://github.com/substack/js-traverse), except merle includes inherited properties.

![get it](http://media.moddb.com/cache/images/groups/1/6/5169/thumb_620x2000/Merle_Dixon_-_The_Walking_Dead_-_Guts34.jpg)


example
-------
    var merle = require('merle');
    
    merle(someObject, function(){
    
      console.log(this.name); // property name of someObject
      console.log(this.depth);
      console.log(this.value);
      console.log(this.path); // the array of property names that got us to this node.
      console.log(this.isLeaf);
      console.log(this.isRoot);
      console.log(this.isOwn);
      
      this.value = 'this replaces the current node';
      
      return false; // returning false will stop merle from walking further down this path
      
      // if you return false the children of this node won't be walked
    });
