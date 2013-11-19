var walk = function(objectToWalk, cb){
	var keys = getKeys(objectToWalk),
		depth = 0,
		state = {
			name: null,
			parent: null,
			get isRoot (){ return this.value === objectToWalk; },
			get isOwn (){ return this._parent.hasOwnProperty(this.name); },
			path: []
		};
		
	doWalk(objectToWalk, keys, state, depth, cb);
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

		if (keepGoing !== false) {
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
