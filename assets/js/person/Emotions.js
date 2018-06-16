function Person_Emotions(p){
	this.init(p || {});
};

Person_Emotions.prototype.init = function(p){
	this.self = p.self;
	
	this.traits = {
		hunger    : { value : 50, invert : true },
		thirst    : { value : 50, invert : true },
		energy    : { value : 50 },
		happiness : { value : 50 },
	};
};

Person_Emotions.prototype.add_item = function(item){
	if(item.is('money')) this.money++;
	if(item.is('food') ) this.food++;
};

Person_Emotions.prototype.item_score = function(emotion, val){
	switch(emotion){
		case 'hunger' :
			return -val * ( 200 * Math.pow( 0.90, ( 100 - this.traits[emotion].value ) ) - 0.8 );
		case 'thirst' : 
			return -val * ( 200 * Math.pow( 0.90, ( 100 - this.traits[emotion].value ) ) - 0.8 );
		case 'energy' : 
			return  val * ( 200 * Math.pow( 0.90, this.traits[emotion].value ) - 0.8 );
		case 'happiness' :                                            
			return  val * ( 150 * Math.pow( 0.95, this.traits[emotion].value ) + 5 );
	};
};