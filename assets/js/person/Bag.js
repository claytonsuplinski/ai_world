function Person_Bag(p){
	this.init(p || {});
};

Person_Bag.prototype.init = function(p){
	this.self = p.self;

	this.traits = {
		money : { value : 0, unit : 'coin'  },
		food  : { value : 0, unit : 'pizza' },
	};
};

Person_Bag.prototype.add_item = function(item){
	if(item.is('money')) this.traits.money.value++;
	if(item.is('food') ) this.traits.food.value++;
};