var walk = function(objectToWalk, cb){
	var keys = getKeys(objectToWalk),
		depth = 0,
		state = {
			name: null,
			parent: null,
			get isRoot (){ return this.node === objectToWalk; },
			update: function(v){ this.parent[this.name] = this.node = v; },
			path: []
		};
		
	doWalk(objectToWalk, keys, state, depth, cb);
};

var doWalk = function(objectNode, keys, state, depth, cb){
	var newKeys;
	state.parent = objectNode;
	state.depth = depth;

	for (var p in objectNode){

		state.name = p;
		state.path.push(state.name);
		state.value = state.node = objectNode[state.name];
		state.isOwn = objectNode.hasOwnProperty(state.name);

		newKeys = getKeys(state.value);
		state.isLeaf = !newKeys || !newKeys.length;

		var keepGoing = cb.call(state, state.node);
		if (keepGoing !== false) {
			doWalk(state.node, newKeys, state, depth+1, cb);
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
