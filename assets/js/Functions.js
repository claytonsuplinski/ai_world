WXSATS.functions = {};

WXSATS.functions.interpolate = function(v1, v2, percent){
	return (1 - percent)*v1 + percent*v2;
};
WXSATS.functions.distance = function(object_1, object_2){
	var sum = 0;
	['x', 'y', 'z'].forEach(function(x){
		if(object_1[x] != undefined && object_2[x] != undefined){
			var val = object_1[x] - object_2[x];
			sum += val * val;
		}
	});
	return Math.sqrt(sum);
};

WXSATS.functions.random = function(min, max){
	return (max - min) * Math.random() + min;
};

WXSATS.functions.cartesian_to_spherical = function(x, y, z){
        var spherical = {};
        spherical.rad = Math.sqrt(x*x + y*y + z*z);
        spherical.lat = 90 - Math.acos(y/spherical.rad)*WXSATS.constants.to_degrees;
        spherical.lon = Math.atan2(x,z)*WXSATS.constants.to_degrees;
        return spherical;
};
WXSATS.functions.spherical_to_cartesian = function(lat, lon, rad){
        var tmp_rot_x = lat * WXSATS.constants.to_radians;
        var tmp_rot_y = lon * WXSATS.constants.to_radians;
        var tmp_cos_x = Math.cos(tmp_rot_x);

        var cartesian = {};
        cartesian.x = rad*Math.sin(tmp_rot_y)*tmp_cos_x;
        cartesian.y = rad*Math.sin(tmp_rot_x);
        cartesian.z = rad*Math.cos(tmp_rot_y)*tmp_cos_x;

        return cartesian;
};

WXSATS.functions.get_xyz = function(mat){
	var m = (mat ? mat.elements : WXSATS.mat.modelview.elements);
	return {
		x : m[0][3],
		y : m[1][3],
		z : m[2][3]
	};
};
WXSATS.functions.get_angles = function(mat){
	var m = (mat ? mat.elements : WXSATS.mat.modelview.elements);
	if(Math.abs(m[0][0]) == 1) return { x : Math.atan2(m[0][2], m[2][3]), y : 0, z : 0 };
	return {
		x : Math.atan2(-m[1][2], m[1][1]),
		y : Math.atan2(-m[2][0], m[0][0]),
		z : Math.asin(m[1][0])
	};
};

WXSATS.functions.angle_between = function(source, target){
	var forward = this.get_xyz( WXSATS.mat.translate([1,0,0], source.modelview) );
	
	var v1 = {}, v2 = {};
	['x', 'y', 'z'].forEach(function(x){
		v1[x] =         forward[x] - source.position[x];
		v2[x] = target.position[x] - source.position[x];
	});
	
	var angle = Math.atan2(v2.x, v2.z) - Math.atan2(v1.x, v1.z);
	
	while(angle > WXSATS.constants.PI2) angle -= WXSATS.constants.PI2;
	while(angle <                    0) angle += WXSATS.constants.PI2;
	
	if(angle > WXSATS.constants.PI) angle -= WXSATS.constants.PI2;
	
	return angle;
};

WXSATS.functions.hex_to_rgb = function(hex){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return (result ? {r: parseInt(result[1], 16)/255,
			  g: parseInt(result[2], 16)/255,
			  b: parseInt(result[3], 16)/255
	} : null);
};
WXSATS.functions.rgb_to_hex = function(color){
	var to_hex = function(val){
		var hex = val.toString(16);
		return (hex.length == 1 ? "0" + hex : hex);
	}
	return "#" + to_hex(Math.round(255*color.r)) + to_hex(Math.round(255*color.g)) + to_hex(Math.round(255*color.b));
};

WXSATS.functions.percent_to_rgb = function(percent){
	percent = 2 * Math.max(0, Math.min(percent, 100)) / 100;
	if(percent < 1) return [ 255, percent * 255, 0 ];
	percent -= 1;
	return [ (1 - percent) * 255, 255, 0 ];;
};

WXSATS.functions.make_id = function(w){
	return w.replace(/ /g, '');
};

WXSATS.functions.extend = function(source_obj, extend_obj){
	Object.keys(extend_obj).forEach(function(key){
		source_obj[key] = extend_obj[key];
	});
};

WXSATS.functions.to_title_case = function(str){
	return str.replace( /\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); } );
};