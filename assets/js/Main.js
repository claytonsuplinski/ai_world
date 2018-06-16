WXSATS.main = {};

WXSATS.main.init = function(){
	$.ajaxSetup({ cache: false, async: false });

	WXSATS.canvas.primary.init();

	try { gl = WXSATS.canvas.primary.c.getContext("experimental-webgl"); }
	catch(e) { alert("Unable to initialize WebGL. Your browser may not support it."); }

	if (gl) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		WXSATS.config_shaders();

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

};

WXSATS.main.draw = function(){

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var clip_factor = Math.min(Math.max(camera.rad/0.5, 0.005), 1);
	if(camera.rad <= 0){clip_factor = 1;}
	var n_clip = clip_factor * 0.01;
	var f_clip = clip_factor * 593314.0;
	WXSATS.mat.perspective(45, $(window).width()/$(window).height(), n_clip, f_clip);

	WXSATS.mat.identity();

	camera.draw();
	
	skybox.draw();
	
	terrain.draw();
	
	person.draw();
	
	WXSATS.cpus.forEach(function(cpu){ cpu.draw(); });
	
	WXSATS.environment.draw();
	
	WXSATS.keyboard.loop();
	
};