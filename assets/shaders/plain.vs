<script id="plain-vs" type="x-shader/x-vertex">
        precision highp float; 

        attribute vec3 vertices_v;
        attribute vec2 vertices_vt;

        uniform mat4 matrices_mv;
        uniform mat4 matrices_p;

        uniform vec3 model_scale;

        varying highp vec2 local_vertices_vt;

        void main(void) {
                vec4 vertex_position = vec4(vertices_v * model_scale, 1.0);
                vec4 vertex = matrices_p * matrices_mv * vertex_position;
                gl_Position = vertex;
                local_vertices_vt = vertices_vt;
        }
</script>
