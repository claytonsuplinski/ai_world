function Shader(v, f, name, attr, uniforms){
	this.vert = v;
	this.frag = f;
	this.name = name;
	this.attr = attr;
	this.uniforms = uniforms;
	
	this.init_shader(name);
};

Shader.prototype.init_shader = function(name){
	this.frag = this.get_shader(gl, this.frag);
	this.vert = this.get_shader(gl, this.vert);
  
	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vert);
	gl.attachShader(this.program, this.frag);
	gl.linkProgram(this.program);

	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) alert("Could not initialise shaders");

	this.program.matrices = {};
	this.program.matrices.modelview  = gl.getUniformLocation(this.program, "matrices_mv");
	this.program.matrices.projection = gl.getUniformLocation(this.program, "matrices_p");

	this.init_attr();

	this.init_program();
};

Shader.prototype.init_attr = function(){
	var self = this;
	this.program.vertices = {};
	this.attr.forEach(function(a){
		self.program.vertices[a] = gl.getAttribLocation(self.program, "vertices_"+a);
	});
};

Shader.prototype.init_program = function(){
	var self = this;
	this.uniforms.forEach(function(u){
		if(!self.program[u[0]]){
			self.program[u[0]] = {};
		}
		self.program[u[0]][u[1]] = gl.getUniformLocation(self.program, u[0]+'_'+u[1]);
	});
};

Shader.prototype.set_matrix_uniforms = function(){
	gl.uniformMatrix4fv(this.program.matrices.projection, false, new Float32Array(WXSATS.mat.projection.flatten()));
	gl.uniformMatrix4fv(this.program.matrices.modelview,  false, new Float32Array(WXSATS.mat.modelview.flatten()));
};

Shader.prototype.get_shader = function(gl, id){
	var shader_element = document.getElementById(id);

	if (!shader_element) return null;

	var source = "";
	var curr_child = shader_element.firstChild;

	while(curr_child){
		if (curr_child.nodeType == 3) source += curr_child.textContent;
		curr_child = curr_child.nextSibling;
	}

	var shader;

	if(shader_element.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if(shader_element.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else{
		return null;
	}

	gl.shaderSource(shader, source);

	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error occurred when compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};

Shader.prototype.use = function(){
	var self = this;
	this.attr.forEach(function(a){ gl.enableVertexAttribArray(self.program.vertices[a]); });
	gl.useProgram(this.program);
};
