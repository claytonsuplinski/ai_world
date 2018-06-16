function Camera(){
	this.lat = 20;
	this.lon = 90;
	this.rad = 35;
};

Camera.prototype.set_target = function(target){
	this.target = target;
};

Camera.prototype.rotate = function(x, y){
	this.lat = Math.max(-90, Math.min(this.lat + x, 90));
	this.lon = (this.lon + y) % 360;
};

Camera.prototype.zoom = function(amount){
	var object_radius = this.target.radius || 1;
	this.rad = Math.max(-1 * object_radius , Math.min( (this.rad + object_radius * amount), 100 * object_radius ) );
};

Camera.prototype.draw = function(){
	WXSATS.mat.translate([0,0,-this.rad]);
	WXSATS.mat.rotate(this.lat, [1,0,0]);
	WXSATS.mat.rotate(this.lon, [0,1,0]);

	WXSATS.mat.transform(this.target.modelview_inv);

	this.modelview     = WXSATS.mat.modelview;
	this.modelview_inv = this.modelview.inverse();
};
