function Mesh(){
	this.v = [];
	this.vn = [];
	this.vt = [];
	this.vertex_indices = [];
	
	this.shader = "";

	this.lighting = "";

	this.scale = "";
};

Mesh.prototype.init_buffers = function(){
	var self = this;

	if(this.shader == "") this.shader = WXSATS.shaders.main;
	
	this.primitive = gl.TRIANGLES;

	this.scale = [1, 1, 1];

	this.texture = {};

	this.buffer = {};

	this.shader.attr.forEach(function(e){
		self.buffer[e] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer[e]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self[e]), gl.STATIC_DRAW);
		switch(e){
			case "v":
			case "vn":
				self.buffer[e].item_size = 3;break;
			case "vt":
				self.buffer[e].item_size = 2;break;
			default:
				self.buffer[e].item_size = 1;break;
		}
	});

	this.buffer.vertex_indices = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.vertex_indices);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), gl.STREAM_DRAW);
	this.buffer.vertex_indices.item_size = 1;
};

Mesh.prototype.set_texture = function(filename, params){
	var self = this;
	params = params || {};

	var type = params.type || "diffuse";

	this.texture[type] = gl.createTexture();
	this.texture[type].image = new Image();
	
	this.texture[type].image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, self.texture[type]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.texture[type].image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		if(params.callback) params.callback();
		
		self.texture[type].done_loading = true;
	}
	
	this.texture[type].image.src = filename;
};

Mesh.prototype.set_uniforms = function(obj){
	var shader = this.shader.program;

	if(shader.model){
		if(shader.model.scale) gl.uniform3f(shader.model.scale, obj.scale[0], obj.scale[1], obj.scale[2]);
	}

	this.shader.set_matrix_uniforms();
};

Mesh.prototype.draw = function (params){
	var self = this;
	params = params || {};

	if(this.buffer && this.texture.diffuse){
		this.shader.use();
		
		if(params.scale    ) this.scale     = params.scale;
		if(params.primitive) this.primitive = params.primitive;

		this.shader.attr.forEach(function(v){
			if(self.buffer[v] != undefined){
				gl.bindBuffer(gl.ARRAY_BUFFER, self.buffer[v]);
				gl.vertexAttribPointer(self.shader.program.vertices[v], self.buffer[v].item_size, gl.FLOAT, false, 0, 0);
			}
		});

		Object.keys(this.texture).forEach(function(texture, i){
			gl.activeTexture(gl["TEXTURE"+i]);
			gl.bindTexture(gl.TEXTURE_2D, self.texture[texture]);
			gl.uniform1i(self.shader.program.texture[texture], i);
		});

		if(this.buffer.vertex_indices){
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.vertex_indices);
			this.set_uniforms(this);
			gl.drawElements(this.primitive, this.vertex_indices.length, gl.UNSIGNED_SHORT, 0);
		}
	}
};
