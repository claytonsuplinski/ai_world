WXSATS.menu = {};

WXSATS.menu.hide = function(){
	$("#menu").addClass('collapsed');
	$("#menu-screen").fadeOut();
};

WXSATS.menu.show = function(){
	this.draw();
	$("#menu").removeClass('collapsed');
	$("#menu-screen").fadeIn();
};

WXSATS.menu.draw = function(){
	$("#menu").html(
		'<div class="logo"><img src="./assets/img/logo.png"/></div>'+
		'<div class="title">AI World<hr></div>'+
		'<div class="options">'+
			WXSATS.config.menu_options.map(function(option){
				var onclick = '';
				if(option.onclick) onclick = 'onclick="WXSATS.menu.hide();' + option.onclick + '"';
				return '<div ' + onclick + ' class="option">'+
					option.name +
				'</div>';
			}).join('')+
		'</div>'
	);
};