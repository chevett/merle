var walk = function(o, cb){
	var root = o;
	var state = {
		name: null,
		parent: null,
		get isRoot (){ return this.node === root; },
		update: function(v){ this.parent[this.name] = this.node = v; },
		path: []
	};

	var onWalk = function(o, cb, state){
		state.parent = o;
	
		for (var p in o){
			state.name = p;
			state.path.push(state.name);

			state.node = o[state.name];
			state.isOwn = Object.hasOwnProperty(state.name);

			var keepGoing = cb.call(state, state.node);
			if (keepGoing === false) continue;

			onWalk(state.node, cb, state);

			state.path.length -= 1;
		}
	};

	onWalk(o, cb, state);
};

module.exports = walk;
