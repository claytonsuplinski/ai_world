function Environment(p){
	this.init(p || {});
};

Environment.prototype.init = function(p){
	this.items = {
		food  : [],
		money : []
	};
};

Environment.prototype.add_food = function(){
	this.items.food.push(new Food({
		model     : WXSATS.models.pizza,
		translate : [WXSATS.functions.random(-110,-90), 0, WXSATS.functions.random(-20, 20)]
	}));
};

Environment.prototype.add_money = function(){
	this.items.money.push(new Money({
		model     : WXSATS.models.coin,
		translate : [WXSATS.functions.random(90,110), 1, WXSATS.functions.random(-20, 20)]
	}));
};

Environment.prototype.update = function(){
	if(Math.random() > 0.98) this.add_food();
	if(Math.random() > 0.98) this.add_money();
};

Environment.prototype.draw = function(){
	var self = this;

	this.update();
	
	Object.keys(this.items).forEach(function(item_label){
		self.items[item_label].forEach(function(item){ item.draw(); });
	});
};