var walk = function(o, cb){
	var root = o;
	var state = {
		name: null,
		parent: null,
		get isRoot (){ return this.node === root; },
		update: function(v){ this.parent[this.name] = this.node = v; },
		path: []
	};

	doWalk(o, cb, state, 0);
};

var doWalk = function(o, cb, state, depth){
	state.parent = o;
	state.depth = depth;

	for (var p in o){
		state.name = p;
		state.path.push(state.name);
		state.value = state.node = o[state.name];
		state.isOwn = o.hasOwnProperty(state.name);
		
		var keepGoing = cb.call(state, state.node);
		if (keepGoing !== false) {
			doWalk(state.node, cb, state, depth+1);
		}
		
		state.path.length -= 1;
	}
};

module.exports = walk;
