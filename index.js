var STOP = {
	no: -1,
	soft: 0,
	hard: 1
};

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
			},
			stop: function(everything){
				if (everything){
					this._stop = STOP.hard;
				} else {
					this._stop = STOP.soft;
				}
			}
		};
		
	var keepGoing = cb.call(state);
	objectToWalk = state.value;

	if (keepGoing !== false){
		doWalk(objectToWalk, keys, state, 1, cb);
	}

	return objectToWalk;
};

var doWalk = function(node, keys, state, depth, cb){
	var newKeys, value;
	state._parent = node;
	state.depth = depth;

	for (var i=0, l=keys.length; i<l; i++){
		state.name = keys[i];
		state.path.push(state.name);
		state.value = value = node[state.name];
		state._stop = STOP.no;

		newKeys = getKeys(state.value);
		state.isLeaf = !newKeys || !newKeys.length;

		var keepGoing = cb.call(state);

		if (keepGoing === false && state._stop === STOP.no){
			state.stop();
		}

		if (state.value !== value){
			node[state.name] = state.value;
		}

		if (state._stop === STOP.no && !state.isCycle) {
			doWalk(node[state.name], newKeys, state, depth+1, cb);
			if (state._stop === STOP.hard) return;
		}

		state.path.pop();

		if (state._stop === STOP.hard) return;
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
