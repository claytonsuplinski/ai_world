WXSATS.loading = {};

WXSATS.loading.start = function(){
	WXSATS.main.init();
	this.is_landing = false;

	$("#loading-screen").show("fade", 1000);
	setTimeout(function(){WXSATS.load.all();}, 1500);
};

WXSATS.loading.main_display = function(){
	setTimeout(function(){
		$("#main-display, #bottom-display").show('fade', 1000);
	}, 1000);
};
