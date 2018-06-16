function Stats(p){
	this.init(p);
};

Stats.prototype.init = function(p){
};

Stats.prototype.show = function(){
	var self = this;
	
	clearInterval(this.interval);
	this.interval = setInterval(function(){ self.draw(); }, 100);
	
	$("#popup-screen").attr('onclick', '').click(function(){ self.hide(); });
	
	$("#popup").show('fade');
};

Stats.prototype.hide = function(){
	clearInterval(this.interval);
	
	$("#popup").hide('fade');
};

Stats.prototype.html_gauge = function(val, min, max, p){
	p = p || {};
	var percent = 100 * (val - min) / (max - min);
	var rgb = WXSATS.functions.percent_to_rgb( (p.invert ? 100 - percent : percent) );
	return '<div class="gauge" style="background:rgba(' + rgb.map( r => r * 2 ).join(',') + ', 0.25);">'+
		'<div class="percent outline-text">'+Number(percent).toFixed(1)+'%</div>'+
		'<div class="gauge-progress" style="width:'+percent+'%;background:rgba(' + rgb.join(',') + ', 0.5);"></div>'+
	'</div>';
};

Stats.prototype.item_position = function(o){
	return 'top :' + ( (o.position.z + 200) / 4 ) + '%;'+
		   'left:' + ( (o.position.x + 200) / 4 ) + '%;';
};

Stats.prototype.draw = function(){
	var self = this;
	$("#popup-content").html(
		'<table class="stats"><tr>'+
			'<td class="people">'+
				'<table class="people-table">'+
					'<tr class="header">'+
						'<th></th>'+
						'<th class="outline-text" colspan="' + ( Object.keys(person.emotions.traits).length ) + '">Emotions</th>'+
						'<th class="outline-text" colspan="' + ( Object.keys(person.bag.traits).length ) + '">Bag</th>'+
					'</tr>'+
					'<tr class="sub-header">'+
						'<th></th>'+
						Object.keys(person.emotions.traits).map( e => '<th class="outline-text">' + WXSATS.functions.to_title_case( e ) + '</th>' ).join('')+
						Object.keys(person.bag.traits).map(      b => '<th class="outline-text">' + WXSATS.functions.to_title_case( b ) + '</th>' ).join('')+
					'</tr>'+
					WXSATS.cpus.map(function(cpu){
						return '<tr class="cpu">'+
								'<td class="name outline-text">' + cpu.name + '</td>'+
								Object.keys(cpu.emotions.traits).map(function(type){ 
									var trait = cpu.emotions.traits[type];
									return '<td class="emotion">' + self.html_gauge(trait.value, 0, 100, { invert : trait.invert }) + '</td>';
								}).join('') +
								Object.keys(cpu.bag.traits).map(function(type){ 
									var trait = cpu.bag.traits[type];
									return '<td class="bag">' + trait.value + ' ' + trait.unit + (trait.value == 1 ? '' : 's') + '</td>';
								}).join('') +
						'</tr>';
					}).join('')+					
				'</table>'+
			'</td>'+
			'<td class="map">'+
				'<div class="map-container">'+
					WXSATS.cpus.map(                   function(o){ var pos = self.item_position(o); return '<div class="item cpu"   style="'+pos+'"><div class="name">'+o.name+'</div></div>'; }).join('')+
					WXSATS.environment.items.money.map(function(o){ var pos = self.item_position(o); return '<div class="item money" style="'+pos+'"></div>'; }).join('')+
					WXSATS.environment.items.food.map( function(o){ var pos = self.item_position(o); return '<div class="item food"  style="'+pos+'"></div>'; }).join('')+
				'</div>'+
			'</td>'+
		'</tr></table>'
	);
};