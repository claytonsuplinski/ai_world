function Money(p){
	this.init(p);
}

Money.prototype = new Item();

Money.prototype.customize = function(params){
	var self = this;
	
	this.name = params.name || '';
	
	this.types = ['money'];
	
	this.radius = 0.5;
	
	this.emotions = {
		happiness : WXSATS.functions.random( 0, 5 )
	};
	
	this.position = WXSATS.functions.get_xyz(this.modelview);
};

Money.prototype.remove = function(){
	WXSATS.environment.items.money.splice( WXSATS.environment.items.money.indexOf(this), 1 );
};

Money.prototype.update = function(){
	this.rotate(1, [0,1,0]);
};