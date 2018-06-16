function Person_Animations(p){
	this.init(p || {});
};

Person_Animations.prototype.init = function(p){
	this.self = p.self;
	
	this.timers = {
		walk : { duration : 20, curr : 0 }
	}
};

Person_Animations.prototype.reset = function(){
	this.self.left_leg.rotate(  -WXSATS.constants.to_degrees * WXSATS.functions.get_angles(this.self.left_leg.modelview ).z, [0,0,1] );
	this.self.right_leg.rotate( -WXSATS.constants.to_degrees * WXSATS.functions.get_angles(this.self.right_leg.modelview).z, [0,0,1] );
};

Person_Animations.prototype.walk = function(){
	this.timers.walk.curr++;
	this.timers.walk.curr %= this.timers.walk.duration;
	
	var prev_frame = this.timers.walk.curr - 1;
	var curr_frame = this.timers.walk.curr;
	
	if(prev_frame < 0) prev_frame += this.timers.walk.duration;
	
	var prev_rot = 40 * Math.sin( WXSATS.constants.PI2 * prev_frame / this.timers.walk.duration );
	var curr_rot = 40 * Math.sin( WXSATS.constants.PI2 * curr_frame / this.timers.walk.duration );
	
	var rot = curr_rot - prev_rot;
	
	this.self.left_leg.rotate(-rot, [0,0,1]);
	this.self.right_leg.rotate(rot, [0,0,1]);
};