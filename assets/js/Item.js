function Item(p){
	this.init(p);
};

Item.prototype.init = function(p){
	p = p || {};

	this.modelview = Matrix.I(4);
	
	if(p.model) this.set_model(p.model);
	
	if(p.translate) this.translate(p.translate);
	if(p.rotate   ) this.rotate(p.rotate);

	this.scale = [1, 1, 1];
	
	if(this.customize) this.customize(p);
};

Item.prototype.set_model = function(obj, img){
	if(img) obj.set_texture(img);
	this.model = obj;
	if(typeof obj.radius != undefined) this.rad = obj.radius;
};

Item.prototype.is = function(val){
	return ( this.types || [] ).indexOf( val ) != -1;
};

Item.prototype.translate = function(v){
	this.modelview     = WXSATS.mat.translate(v, this.modelview);
	this.modelview_inv = this.modelview.inverse();	
};

Item.prototype.rotate = function(angle, v){
	this.modelview     = WXSATS.mat.rotate(angle, v, this.modelview);
	this.modelview_inv = this.modelview.inverse();
};

Item.prototype.draw = function(){
	if(this.update) this.update();

	WXSATS.mat.push();
	
		WXSATS.mat.modelview = WXSATS.mat.modelview.x( this.modelview );

		if(this.model.shader.program){
			this.model.shader.use();
			gl.uniformMatrix4fv(this.model.shader.program.model.modelview, false, new Float32Array(this.modelview.flatten()));
			gl.uniformMatrix4fv(this.model.shader.program.model.normal, false, new Float32Array(WXSATS.mat.norm(this.modelview).flatten()));
		}

		this.model.draw();

	WXSATS.mat.pop();
};
