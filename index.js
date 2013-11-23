var walk = function(objectToWalk, cb){
	var keys = getKeys(objectToWalk),
		state = {
			name: null,
			value: objectToWalk,
			depth: 0,
			path: [],
			_parent: null,
			get isOwn (){ return !this.isRoot && this._parent.hasOwnProperty(this.name); },
			get isRoot (){ return this.value === objectToWalk; },
			get isCycle (){
				var o = objectToWalk;
				for (var i=0, l=this.path.length-1; i<l; i++){
					if (o === this.value) return true;
					o = o[this.path[i]];
				}
				return false;
			}
		};
		
	var keepGoing = cb.call(state);
	objectToWalk = state.value;

	if (keepGoing !== false){
		doWalk(objectToWalk, keys, state, 1, cb);
	}

	return objectToWalk;
};

var doWalk = function(objectNode, keys, state, depth, cb){
	var newKeys, value;
	state._parent = objectNode;
	state.depth = depth;

	for (var i=0, l=keys.length; i<l; i++){
		state.name = keys[i];
		state.path.push(state.name);
		state.value = value = objectNode[state.name];

		newKeys = getKeys(state.value);
		state.isLeaf = !newKeys || !newKeys.length;

		var keepGoing = cb.call(state);

		if (state.value !== value){
			objectNode[state.name] = state.value;
		}

		if (keepGoing !== false && !state.isCycle) {
			doWalk(objectNode[state.name], newKeys, state, depth+1, cb);
		}

		state.path.length -= 1;
	}
};

var getKeys = function(value){
	var arr = [];
	for (var key in value){
		arr.push(key);
	}

	return arr;
};

module.exports = walk;
