WXSATS.keyboard = {};

WXSATS.keyboard.keys = [
	{val: "A", code: 65, hold: function(){ person.turn( 5); }},
	{val: "D", code: 68, hold: function(){ person.turn(-5); }},
	{val: "W", code: 87, hold: function(){ person.walk( 1); }}
];

WXSATS.keyboard.holdable_keys = WXSATS.keyboard.keys.filter(function(key){ return key.hold; });

WXSATS.keyboard.get = function(val){
	return this.keys.find(function(key){ return key.val == val; }) || false;
};

WXSATS.keyboard.get_from_keycode = function(code){
	return this.keys.find(function(key){ return key.code == code; }) || false;
};

WXSATS.keyboard.clear_all = function(){
	this.pressed = [];
	this.keys.forEach(function(key){ key.pressed = false; });
};

WXSATS.keyboard.pressed = [];

WXSATS.keyboard.loop = function(){
	WXSATS.keyboard.holdable_keys.forEach(function(key){ if(key.pressed) key.hold(); });
};

document.addEventListener('keydown', function(event) {
	if(WXSATS.keyboard.pressed.indexOf(event.keyCode) == -1){
		WXSATS.keyboard.pressed.push(event.keyCode);
		var key = WXSATS.keyboard.get_from_keycode(event.keyCode);
		if(key){
			key.pressed = true;
			if(key.down) key.down();
		}
	}
});

document.addEventListener('keyup', function(event) {
	var pressed_index = WXSATS.keyboard.pressed.indexOf(event.keyCode);
	if(pressed_index != -1) WXSATS.keyboard.pressed.splice(pressed_index, 1);

	var key = WXSATS.keyboard.get_from_keycode(event.keyCode);
	if(key) key.pressed = false;
});