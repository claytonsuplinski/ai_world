<script id="plain-fs" type="x-shader/x-fragment">
        precision highp float; 

        uniform highp sampler2D texture_diffuse;

        varying highp vec2 local_vertices_vt;

        void main(void) {
                vec4 texture_color = vec4(0.0, 0.0, 0.0, 0.0);

                vec2 vt = vec2(local_vertices_vt.s, local_vertices_vt.t);

                texture_color = texture2D(texture_diffuse, vt); 

                gl_FragColor = texture_color;
        }
</script>
