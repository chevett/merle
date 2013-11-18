var walk = function(o, cb){
	var root = o;
	var state = {
		name: null,
		parent: null,
		get isRoot (){ return this.node === root; },
		update: function(v){ this.parent[this.name] = this.node = v; }
		
	};

	var onWalk = function(o, cb){
			
		state.parent = o;

		for (var p in o){
			state.name = p;
			state.node = o[state.name];
			state.isOwn = Object.hasOwnProperty(state.name);

			var keepGoing = cb.call(state, state.node);
			if (keepGoing === false) continue;

			onWalk(state.node, cb);
		}
	};

	onWalk(o, cb);
};


module.exports = walk;
