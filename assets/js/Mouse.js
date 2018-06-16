WXSATS.mouse = { vals : {} };

WXSATS.mouse.vals.prev = { x : 0, y : 0 };

WXSATS.mouse.ignore = function(){
	return ($('body').find('.main-menu:hover').length > 0);
};

document.addEventListener('mousemove', function(event) {
	WXSATS.mouse.vals.ignore = WXSATS.mouse.ignore();

	if(!WXSATS.mouse.vals.ignore){
		if(WXSATS.mouse.vals.left)  camera.rotate( (event.clientY - WXSATS.mouse.vals.prev.y) / 8, (event.clientX - WXSATS.mouse.vals.prev.x) / 8 );
		if(WXSATS.mouse.vals.right) camera.zoom( (20 * (2 * (event.clientY - WXSATS.mouse.vals.prev.y) - window.innerHeight) / window.innerHeight + 20) );
		WXSATS.mouse.vals.prev.x = event.clientX;
		WXSATS.mouse.vals.prev.y = event.clientY;
	}
});

document.addEventListener('mousedown', function(event) {
	if(event.which == 1) WXSATS.mouse.vals.left  = true;
	if(event.which == 3) WXSATS.mouse.vals.right = true;
});

document.addEventListener('mouseup', function(event) {
	if(event.which == 1) WXSATS.mouse.vals.left  = false;
	if(event.which == 3) WXSATS.mouse.vals.right = false;
});

WXSATS.mouse.wheel_handler = function(e){
	if(!WXSATS.mouse.ignore()){
		var e = window.event || e;
		camera.zoom(-Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) );
	}
};

