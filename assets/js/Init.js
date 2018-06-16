WXSATS.load = {};
WXSATS.load.functions = {
	"Event Handlers": {
		functions: [
			{
				name: "Mouse Handler",
				init: function(callback){
					if(document.addEventListener){
						document.addEventListener('mousewheel'    , WXSATS.mouse.wheel_handler, false);
						document.addEventListener('DOMMouseScroll', WXSATS.mouse.wheel_handler, false);
					}
					else{
						document.addEventListener('onmousewheel', WXSATS.mouse.wheel_handler, false);
					}
					callback();
				}
			},
			{
				name: "Update Intervals",
				init: function(callback){
					setInterval(WXSATS.main.draw, 15);
					callback();
				}
			}
		]
	},
	"Objects": {
		functions: [
			{
				name: "Models",
				init: function(callback){
					WXSATS.models.person = {};
					
					['arm', 'leg', 'torso', 'head'].forEach(function(part, i){
						var basename = './assets/models/person/'+part+'/'+part;
						
						WXSATS.models.person[part] = new OBJ({
							filename : basename + '.obj',
							diffuse  : basename + '.png',
							shader   : WXSATS.shaders.plain
						});
					});
					
					['coin', 'pizza', 'terrain'].forEach(function(obj){
						WXSATS.models[obj] = new OBJ({
							filename : './assets/models/'+obj+'/'+obj+'.obj', 
							diffuse  : './assets/models/'+obj+'/'+obj+'.png', 
							shader   : WXSATS.shaders.plain
						});
					});
					
					WXSATS.models.skybox = new OBJ({
						filename : "./assets/models/skybox/skybox.obj", 
						diffuse  : "./assets/models/skybox/skybox.png", 
						scale    : 10,
						shader   : WXSATS.shaders.plain
					});
					
					callback();
				}
			},
			{
				name: "Items",
				init: function(callback){
					terrain = new Item({ model : WXSATS.models.terrain });
				
					skybox = new Item({ model : WXSATS.models.skybox });
				
					person = new Person();
					person.translate([0,0,130]);
					person.rotate(90, [0,1,0]);

					WXSATS.cpus = [];
					for(var i=0; i < WXSATS.config.num_cpus; i++){
						WXSATS.cpus.push(new Person({
							name      : 'CPU ' + (i+1),
							cpu       : true,
							translate : [WXSATS.functions.random(-100,100), 0, WXSATS.functions.random(-100,100)]
						}));
					}
					
					WXSATS.stats.cpus = new Stats({ list : WXSATS.cpus, type : 'people' });
					
					WXSATS.environment = new Environment();
					
					camera.set_target(person);
				
					callback();
				}
			}
		]
	}
};

WXSATS.load.key       = 0;
WXSATS.load.index     = 0;
WXSATS.load.queue     = [];
WXSATS.load.num_steps = 0;
WXSATS.load.callback  = false;
WXSATS.load.objects = function(){
	var queue_was_empty = (WXSATS.load.queue.length == 0);
	Array.prototype.slice.call(arguments).forEach(function(k){ if(WXSATS.load.functions[k]){ WXSATS.load.queue.push(k);WXSATS.load.num_steps++; } });

	var element_class = function(arr){ return ( arr.length <= 2 ? 'loading-element-lg' : ( arr.length <= 10 ? 'loading-element-md' : 'loading-element-sm' ) ); };

	var load_item = function(fns){
		var f = fns[WXSATS.load.index];
		f.init(function(){
			$(".loading-container #loading-element-"+WXSATS.functions.make_id(f.name)).addClass("active");
			if(WXSATS.load.index >= fns.length-1){
				WXSATS.load.index = 0;
				WXSATS.load.functions[WXSATS.load.key] = false;
				WXSATS.load.queue.shift();
				if(WXSATS.load.queue.length) load();
				else{
					setTimeout(function(){
						if(WXSATS.load.callback){
							WXSATS.load.callback();
							WXSATS.load.callback = false;
						}
						$('#loading-screen').hide('fade');
						WXSATS.loading.main_display();
						WXSATS.load.num_steps = 0;
					}, 1500);
				} 
			}
			else{
				WXSATS.load.index++;
				load_item(fns);
			}
		});
	};

	var load = function(){
		WXSATS.load.key = WXSATS.load.queue[0];
		var fns = WXSATS.load.functions[WXSATS.load.key].functions;
		$("#loading-screen .content").delay(1000).hide("fade", 500, function(){
			var loading_element_class = element_class(fns);
			$("#loading-screen .content").html(
				'<div class="configuration-settings">'+
					'<span class="loading-title">'+
						'<span class="category hidden-sm hidden-xs">'+
							WXSATS.load.key.toUpperCase()+
							'<i class="fa fa-ellipsis-v hidden-sm hidden-xs"></i> '+
							'<span class="current-step"></span>'+
						'</span>'+
					'</span>'+
					'<div class="loading-container">'+
						fns.map(function(a){ 
							if(a.list){
								return a.list.map(function(l){ return '<div id="loading-element-'+WXSATS.functions.make_id(a.name+"-"+l)+'" class="loading-element loading-element-sm">'+
									'<div class="loading-element-sm loading-element-middle">'+l.toUpperCase()+'</div>'+
								'</div>'; }).join("");
							}
							return '<div id="loading-element-'+WXSATS.functions.make_id(a.name)+'" class="loading-element '+loading_element_class+'">'+
								'<div class="'+loading_element_class+' loading-element-middle">'+
									(a.percent ? 
										'<table><tr><td>'+a.name.toUpperCase()+'</td></tr><tr><td class="loading-percentage">&nbsp;</td></tr></table>' : 
										a.name.toUpperCase()
									)+
								'</div>'+
							'</div>'; 
						}).join("")+
					'</div>'+
				'</div>'
			);
			$("#loading-screen .content .loading-title .current-step").html( ( (WXSATS.load.num_steps-WXSATS.load.queue.length) + 1 ) + ' <span class="of">OF</span> ' + WXSATS.load.num_steps );
			$("#loading-screen .content").show("fade", 500);
		});

		setTimeout(function(){
			load_item(fns);
		}, 2500);
	};
	if(queue_was_empty && WXSATS.load.queue.length){
		if(!this.once){
			$("#loading-screen .content").html(
				'<span class="loading-title hidden-sm hidden-xs">' +
					"WXSATS".split("").map(function(a){ return '<span class="col-xs-1">'+a+'</span>'; }).join("") +
				'</span>' +
				'<span class="loading-title hidden-lg hidden-md">' + 
					"WXSATS".split("").map(function(a){ return '<span class="col-xs-12">'+a+'</span>'; }).join("") +
				'</span>' +
				'<div class="loading-spinner"><i class="fa fa-spin fa-circle-o-notch"></i></div>'
			);
			this.once = true;
		}
		else{
			var loading_element_class = element_class(WXSATS.load.queue);
			$("#loading-screen .content").html(
				'<div class="configuration-settings">'+
					'<span class="loading-title">WXSATS <i class="fa fa-ellipsis-h hidden-sm hidden-xs"></i> LOADING</span>'+
					'<div class="loading-container">'+
						WXSATS.load.queue.map(function(a){
							return '<div class="loading-element '+loading_element_class+' preload">'+
								'<div class="'+loading_element_class+' loading-element-middle">'+a.toUpperCase()+'</div>'+
							'</div>';
						}).join("")+
					'</div>'+
				'</div>'
			);
		}
		$('#loading-screen').show('fade');
		load();
	}
	else if(queue_was_empty && !WXSATS.load.queue.length){
		if(WXSATS.load.callback) WXSATS.load.callback();
		WXSATS.load.callback = false;
		WXSATS.load.num_steps = 0;
	}
};

WXSATS.load.all = function(){
	WXSATS.load.objects("Objects", "Event Handlers");
};