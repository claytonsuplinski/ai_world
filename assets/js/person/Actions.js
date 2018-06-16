function Person_Actions(p){
	this.init(p || {});
};

Person_Actions.prototype.init = function(p){
	this.self = p.self;
};

Person_Actions.prototype.walk_towards_target = function(){
	var person = this.self;
	var target = person.target;

	var walk_mag = WXSATS.functions.random(0,1);

	person.walk( Math.min( person.distance(target), walk_mag ) );
	person.turn( WXSATS.functions.angle_between( person, target ) * WXSATS.constants.to_degrees );
	
	person.emotions.traits.energy.value    -= WXSATS.functions.random(walk_mag, walk_mag + 1) / 70;
	person.emotions.traits.hunger.value    += WXSATS.functions.random(walk_mag, walk_mag + 1) / 70;
	person.emotions.traits.happiness.value -= WXSATS.functions.random(0,0.002);
	
	if( person.distance(target) <= person.radius + target.radius ){
		Object.keys(target.emotions).forEach(function(emotion){
			person.emotions.traits[emotion].value += target.emotions[emotion];
		});
		
		person.memories.save({
			memory   : 'long',
			types    : target.types,
			emotions : target.emotions,
			position : target.position
		});
	
		if(target.is('money')) person.bag.add_item(target);

		target.remove();
	}
};

Person_Actions.prototype.random_walk = function(){
	person.emotions.traits.happiness.value -= WXSATS.functions.random(0,0.002);
	this.self.walk( WXSATS.functions.random(  0, 2) );
	this.self.turn( WXSATS.functions.random( -5, 5) );
};