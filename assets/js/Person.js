function Person(p){
	this.init(p);
};

Person.prototype = new CompositeItem();

Person.prototype.customize = function(params){
	var self = this;
	
	this.name = params.name || '';
	
	this.actions    = new Person_Actions(   { self : this });
	this.animations = new Person_Animations({ self : this });
	this.bag        = new Person_Bag(       { self : this });
	this.emotions   = new Person_Emotions(  { self : this });
	this.memories   = new Person_Memories(  { self : this });
	
	this.radius = 0.5;
	
	this.head = new Item({ model : WXSATS.models.person.head, translate : [0,5,0] });
	
	this.torso = new Item({ model : WXSATS.models.person.torso, translate : [0,5,0] });
	
	this.left_arm  = new Item({ model : WXSATS.models.person.arm, translate : [0,5,-0.85] });
	this.right_arm = new Item({ model : WXSATS.models.person.arm, translate : [0,5, 0.85] });
	
	this.left_leg  = new Item({ model : WXSATS.models.person.leg, translate : [0,3,-0.5] });
	this.right_leg = new Item({ model : WXSATS.models.person.leg, translate : [0,3, 0.5] });
	
	this.is_cpu = params.cpu || false;
	
	['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg'].forEach(function(part){
		self.children.push(self[part]);
	});	
	
	this.position = WXSATS.functions.get_xyz(this.modelview);
};

Person.prototype.die = function(){
	this.dead   = true;
	this.update = false;
	this.animations.reset();
	this.rotate(90, [0,0,1]);
};

Person.prototype.walk = function(mag){
	this.translate([mag,0,0]);
	this.position = WXSATS.functions.get_xyz(this.modelview);
	
	this.animations.walk();
};

Person.prototype.turn = function(mag){
	this.rotate(mag, [0,1,0]);
};

Person.prototype.distance = function(item){
	return WXSATS.functions.distance(
		{ x : this.position.x, z : this.position.z }, 
		{ x : item.position.x, z : item.position.z }
	);
};

Person.prototype.get_nearest_item = function(items){
	var self = this;
	return items.map(function(f){
			return { obj : f, dist : self.distance(f) };
		}).sort(function(a,b){ return (a.dist > b.dist ? 1 : -1); })[0].obj;
};

Person.prototype.select_target = function(){
	var self = this;

	var targets = [];
		
	Object.keys(WXSATS.environment.items).forEach(function(key){
		if(WXSATS.environment.items[key].length){
			var item = self.get_nearest_item( WXSATS.environment.items[key] );
			
			var emotions = {};
			
			var memory = self.memories.long_term.find( m => m.types.sort().join(',') == item.types.sort().join(',') );
			
			Object.keys( ( memory ? memory.emotions : self.emotions.traits ) ).forEach(function(emotion){ 
				emotions[emotion] = ( memory ? memory.emotions[emotion] : 10 );
			});
			
			var score = 2 / self.distance(item);
			
			Object.keys(self.emotions.traits).forEach(function(emotion){
				var item_score = ( emotions[emotion] != undefined ? self.emotions.item_score( emotion, emotions[emotion] ) : 0 );
				if(!memory) item_score = Math.max(0, item_score);
				score += item_score;
			});
			
			targets.push({ item : item, score : score });
		}
	});
	
	targets.sort( (a,b) => (a.score < b.score ? 1 : -1) );
	
	this.target = ( targets.length ? ( targets[0].score >= 0 ? targets[0].item : false ) : false );
};

Person.prototype.action = function(){
	if(this.target){
		this.actions.walk_towards_target();
	}
	else{
		if(Math.random() > 0.8) this.actions.random_walk();
	}
	
	if(this.emotions.traits.energy.value <= 0) this.die();
};

Person.prototype.observe = function(){
};

Person.prototype.update = function(){
	if(this.is_cpu){
		this.observe();
		this.select_target();
		this.action();
	}
};