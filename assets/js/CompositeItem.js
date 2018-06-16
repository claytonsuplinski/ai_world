function CompositeItem(p){
	this.init(p);
};

CompositeItem.prototype.init = function(p){
	p = p || {};

	this.children = [];
	
	this.modelview     = Matrix.I(4);
	this.modelview_inv = this.modelview.inverse();
	
	if(p.translate) this.translate(p.translate);
	if(p.rotate   ) this.rotate(p.rotate);
	
	if(this.customize) this.customize(p);
};

CompositeItem.prototype.translate = function(v){
	this.modelview     = WXSATS.mat.translate(v, this.modelview);
	this.modelview_inv = this.modelview.inverse();	
};

CompositeItem.prototype.rotate = function(angle, v){
	this.modelview     = WXSATS.mat.rotate(angle, v, this.modelview);
	this.modelview_inv = this.modelview.inverse();
};

CompositeItem.prototype.draw = function(){
	if(this.update) this.update();

	WXSATS.mat.push();
		
		WXSATS.mat.modelview = WXSATS.mat.modelview.x( this.modelview );

		this.children.forEach(function(child){ child.draw(); });
	
	WXSATS.mat.pop();
};