WXSATS.constants = {};
WXSATS.constants.PI = Math.PI;
WXSATS.constants.PI2 = 2 * Math.PI;
WXSATS.constants.ONE_800 = 1/800;
WXSATS.constants.to_degrees = 180/Math.PI;
WXSATS.constants.to_radians = Math.PI/180;
WXSATS.constants.month_names = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
WXSATS.constants.month_abbrs = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
WXSATS.constants.max_texture = 0;

camera = new Camera();

WXSATS.config = {};

WXSATS.config.menu_options = [
	{ name : 'CPUs', onclick : 'WXSATS.stats.cpus.show();' }
];

WXSATS.config.num_cpus  = 10;
WXSATS.config.num_food  = 20;
WXSATS.config.num_money = 30;

WXSATS.models = {};

WXSATS.stats = {};

WXSATS.canvas = {};
WXSATS.canvas.primary = {};
WXSATS.canvas.primary.init = function(){
	this.c = document.getElementById("primary-canvas");
	this.c.width  = $(window).width();
	this.c.height = $(window).height();
};
WXSATS.canvas.primary.resize = function(){
	this.c = document.getElementById("primary-canvas");
	this.c.style.width  = $(window).width();
	this.c.style.height = $(window).height();
};

window.addEventListener('resize', WXSATS.canvas.primary.resize);

WXSATS.shaders = {};
WXSATS.shaders.plain = {attr: ["v", "vt"], uniforms:[
        ["texture", "diffuse"],
        ["model", "scale"]
]};

WXSATS.config_shaders = function(){
        Object.keys(WXSATS.shaders).forEach(function(name){
                ["vs", "fs"].forEach(function(ext){
                        $.ajax({
                                url: './assets/shaders/'+name+'.'+ext,
                                async: false,
                                dataType: 'html',
                                success: function(data){
                                        $('html').append(data);
                                }
                        });
                }); 
                var shader = WXSATS.shaders[name];
                WXSATS.shaders[name] = new Shader(name+"-vs", name+"-fs", name, shader.attr, shader.uniforms);
        });
};
