function Food(p){
	this.init(p);
}

Food.prototype = new Item();

Food.prototype.customize = function(params){
	var self = this;
	
	this.name = params.name || '';
	
	this.types = ['food'];
	
	this.radius = 0.5;
	
	this.emotions = {
		hunger : -WXSATS.functions.random( 5, 7 ),
		energy :  WXSATS.functions.random( 5, 7 )
	};
	
	this.init_position = params.translate;
	
	this.position = WXSATS.functions.get_xyz(this.modelview);
};

Food.prototype.remove = function(){
	WXSATS.environment.items.food.splice( WXSATS.environment.items.food.indexOf(this), 1 );
};

Food.prototype.update = function(){
	this.rotate(1, [0,1,0]);
};