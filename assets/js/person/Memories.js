function Person_Memories(p){
	this.init(p || {});
};

Person_Memories.prototype.init = function(p){
	this.self = p.self;
	
	this.long_term  = [];
	this.short_term = [];
};

Person_Memories.prototype.save = function(p){
	var memory = {
		types    : p.types,
		emotions : p.emotions,
		position : p.position
	};

	switch(p.memory){
		case 'short':
			this.short_term.push(memory);
			break;
		case 'long':
			this.long_term.push(memory);
			break;
	};
};