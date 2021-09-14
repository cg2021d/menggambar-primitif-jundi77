function main_triangle() {
    /** @type {HTMLElement} */
    var canvas = document.getElementById('myCanvasTri')
    
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext("webgl")

    // definisikan vertex2
    /**
     * 
     *             .          .    .          (               .          .    .       
     *             .          .    .          (               .          .    .       
     *             .          .    .          #               .          .   %.       
     *             .          .    .      *(  #               .         *#    .       
     *             .          .    .      ,*  #               .        #(#    .       
     *             .          .    .          #               .     /#   #    .       
     *             .          .    .          #               .   #,     #    .       
     *             .          .    .          #               ./#        #    .       
     *             .          .    .          #              #,          #    .       
     *             .          .    .          #           /#  .          #    .       
     * .. .........,   . .....,..... . ......*&,.... . .#, .....%  ... ..#   .,.......
     *             .          .    .          #      /#       .          #    .       
     *        .    .          .    .         ,%.   #,         .          #    .       
     *             .          .    .          # /#            .          #    .       
     *  .     /    #     .    %    %    .     O,   (     .    %    *     #    %    .. 
     *             /          .    .       /# #               .          #    .       
     *             *(         .    .     #.   #               .          #.   .       
     *             ((         .    .  (#      #               .          #.   .       
     *             .          .    .#.        #               .          #    .       
     *             .          .  (#.          #               .          #    .       
     *             .          .#.  .          #               .          #    .       
     *             .        ((.    .          (               .          #    .       
     *             .     .#.  .    .          #               .          #    .       
     *             .   ((     .    .          #               .          #    .       
     *             ..#.       .    .          #               .          #    .       
     *,,,,,,,,,,,,(#######################################################(,,,,,,,,,,,
     *             .          .    .          #               .          .    .       
     *        . &.,,          .    .         ,%.   .          .          . %  .       
     *             .          .    .          #               .          .    .       
     *
     * Misal mau buat segitiga yang di tengah,
     *  A(0.0, 0.5), B(0.5, -0.5), C(-0.5, -0.5)
     */

    /** @type {Array} */
    var vertices = [
        0.0, 0.5,       // titik A
        0.5, -0.5,      // titik B
        -0.5, -0.5,      // titik C
    ]

    /**
     * Simpan dulu semua titik di buffer
     * Buffer hanya bisa menggambar satu titik
     * Sebagai tempat simpan sementara dari informasi yang akan digambar
     */
    /** @type {WebGLBuffer} */    
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // null karena untuk mengosongkan buffer

    /** @type {String} */
    var vertexShaderCode = `
    attribute vec2 a_Position;
    void main() {
        gl_Position = vec4(a_Position, 0.0, 1.0);
        gl_PointSize = 20.0;
    }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    //definisi fragment
    var fragmentShaderCode = `
    void main(){
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
    `;

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    // -- satu package compile oleh cpu
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    // -- satu package compile oleh cpu

    // gambar titik mindahin dari buffer ke canvas, supaya dapat digambar fragment shader (?)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "a_Position"); // a_Position yang disebut di vertexShaderCode
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPosition);

    gl.clearColor(1.0, 1.0, 1.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.LINES, 0, 6); // titik digambar 1-1, sehingga titiknya harus 6
    // gl.drawArrays(gl.LINE_LOOP, 0, 3); // titik digambar looping gitu, jadi cuma perlu 3
    // gl.drawArrays(gl.LINE_STRIP, 0, 4); // titiknya perlu 4, "To draw a series of connected line segments."
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);

}