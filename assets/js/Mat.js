WXSATS.mat = {};
WXSATS.mat.stack = [];
WXSATS.mat.modelview;
WXSATS.mat.projection;
WXSATS.mat.identity = function(){
	this.modelview = Matrix.I(4);
};
WXSATS.mat.perspective = function(angle, aspect, near, far){
	this.projection = makePerspective(angle, aspect, near, far);
};
WXSATS.mat.push = function(){
	this.stack.push(this.modelview.dup());
};
WXSATS.mat.pop = function(){
	if (!this.stack.length) throw("Can't pop from an empty matrix stack.");
	this.modelview = this.stack.pop();
};
WXSATS.mat.transform = function(mat){
	this.modelview = this.modelview.x(mat);
};
WXSATS.mat.translate = function(v, modelview){
	var transform = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
	if(modelview) return modelview.x( transform );
	this.transform( transform );
};
WXSATS.mat.rotate = function(angle, v, modelview){
	var mat = modelview || this.modelview;
	var transform = Matrix.Rotation(angle * WXSATS.constants.to_radians, $V([v[0], v[1], v[2]])).ensure4x4();
	var result = mat.x( transform );
	
	// Handle issue with 90 and 270 degrees causing weird glitching
	if(result.elements[0][2] >= 1 || result.elements[0][2] <= -1){
		transform = Matrix.Rotation((angle + 0.00001) * WXSATS.constants.to_radians, $V([v[0], v[1], v[2]])).ensure4x4();
		result = mat.x( transform );
	}
	
	if(modelview) return result;
	this.modelview = result;
};
WXSATS.mat.norm = function(mv){
	var result = Matrix.I(4);
	var mv_inverse = mv.inverse();
	if(mv_inverse != null) result = mv_inverse.transpose();
	return result;
};
