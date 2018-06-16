function OBJ(params){
	params = params || {};

	this.filename = params.filename;
	this.scale    = params.scale || 1;
	this.diffuse  = params.diffuse;

	this.async = (params.async == undefined ? true : params.async);
	
	if(params.shader)             this.shader   = params.shader;
	if(params.callback)           this.callback = params.callback;

	this.load_vertices();
};

OBJ.prototype = new Mesh();

OBJ.prototype.load_vertices = function (){

	var self = this;

	$.ajax({
		url: self.filename,
		dataType: "text",
		async: self.async,
		success: function (data){
		
			self.v              = [];
			self.vn             = [];
			self.vt             = [];
			self.vertex_indices = [];

			var all_v  = [];
			var all_vt = [];
			var all_vn = [];
			var faces  = [];

			var lines = data.split("\n");
			lines.forEach(function(line){			
				if(line.length){
					var vals = line.split(/[\s]+/);
					if(line[0] == "v"){
						vals = vals.map(function(word){ return parseFloat(word); });
						if     (line[1] == " " && vals.length > 3) all_v.push(  self.scale * vals[1], self.scale * vals[2], self.scale * vals[3] );
						else if(line[1] == "n" && vals.length > 3) all_vn.push(              vals[1],              vals[2],              vals[3] );
						else if(line[1] == "t" && vals.length > 2) all_vt.push(              vals[1],          1 - vals[2] );
					}
					else if(line[0] == "f" && vals.length > 3) faces.push(vals[1], vals[2], vals[3]);
				}
			});
			
			faces.forEach(function(face, i){
				self.vertex_indices.push(i);

				var face = face.split("/").map(function(j){ return parseInt(j); });

				if(face.length > 2){
					var idx_v  = 3 * face[0];
					var idx_vt = 2 * face[1];
					var idx_vn = 3 * face[2];

					self.v.push(  all_v[ idx_v -3], all_v[ idx_v -2], all_v[ idx_v -1] );
					self.vt.push( all_vt[idx_vt-2], all_vt[idx_vt-1] );
					self.vn.push( all_vn[idx_vn-3], all_vn[idx_vn-2], all_vn[idx_vn-1] );
				}
			});

			self.init_buffers();
			
			self.set_texture(self.diffuse);

			if(self.callback) self.callback();
			
		}
	});

};