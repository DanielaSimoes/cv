function Piece(gl, init_pos, vertices, colors, sx, sy, sz, globalTz) {
    // web gl object
    this.gl = gl;

    this.sx = sx;
    this.sy = sy;
    this.sz = sz;

    this.vertices = vertices;
    this.init_pos = init_pos;
    this.colors = colors;

    this.globalTz = globalTz;
    this.globalAngleYY = 0.0;
    this.globalAngleXX = 0.0;

    this.tx = init_pos.tx;
    this.ty = init_pos.ty;
    this.tz = init_pos.tz;

    this.angleXX = init_pos.angleXX;
    this.angleYY = init_pos.angleYY;
    this.angleZZ = init_pos.angleZZ;

    this.triangleVertexPositionBuffer = this.gl.createBuffer();
    this.triangleVertexColorBuffer = this.gl.createBuffer();

    this.drawScene(sx, sy, sz, globalTz);
}

Piece.prototype.resetValues = function () {
    this.tx = this.init_pos.tx;
    this.ty = this.init_pos.ty;
    this.tz = this.init_pos.tz;

    this.angleXX = this.init_pos.angleXX;
    this.angleYY = this.init_pos.angleYY;
    this.angleZZ = this.init_pos.angleZZ;
};

Piece.prototype.initBuffers = function () {
    // Coordinates
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = this.vertices.length / 3;

    // Associating to the vertex shader
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
        this.triangleVertexPositionBuffer.itemSize,
        this.gl.FLOAT, false, 0, 0);

    // Colors
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 3;
    this.triangleVertexColorBuffer.numItems = this.colors.length / 3;

    // Associating to the vertex shader
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
        this.triangleVertexColorBuffer.itemSize,
        this.gl.FLOAT, false, 0, 0);

    // enable depth test
    this.gl.enable(this.gl.DEPTH_TEST);
};

Piece.prototype.drawPiece = function (angleXX, angleYY, angleZZ, sx, sy, sz, tx, ty, tz, mvMatrix) {
    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));
    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the Model View Matrix to apply the current transformation

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
};

Piece.prototype.drawScene = function (sx, sy, sz, globalTz) {
    this.shaderProgram = initShaders(this.gl);
    this.initBuffers();

    // Drawing the 3D scene
    var pMatrix;
    var mvMatrix = mat4();

    // A standard view volume.
    // Viewer is at (0,0,0)
    // Ensure that the model is "inside" the view volume
    pMatrix = perspective( 45, 1, 0.05, 15 );

    // Passing the Projection Matrix to apply the current projection
    var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");

    // Computing the Projection Matrix
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
    mvMatrix = translationMatrix(0, 0, globalTz);
    mvMatrix = mult(translationMatrix(0, 0, globalTz),
        rotationYYMatrix(this.globalAngleYY));
    mvMatrix = mult(mult(translationMatrix(0, 0, globalTz),
        rotationYYMatrix(this.globalAngleYY)),
        rotationXXMatrix(this.globalAngleXX));

    // Instantianting the current piece
    this.drawPiece(this.angleXX, this.angleYY, this.angleZZ,
        sx, sy, sz,
        this.tx, this.ty, this.tz,
        mvMatrix);
};
