var texture, gl, tmp;

function Piece(gl, init_pos, pos, vertices, colors, background, sx, sy, sz, globalTz) {
    // web gl object
    this.gl = gl;

    this.done = true;
    this.vertices = vertices;
    this.init_pos = init_pos;
    this.colors = colors;
    this.normals = [
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0
    ];

    this.globalTz = globalTz;
    this.globalAngleYY = 0.0;
    this.globalAngleXX = 0.0;

    // The translation vector
    this.tx = init_pos.tx;
    this.ty = init_pos.ty;
    this.tz = init_pos.tz;

    // The rotation angles in degrees
    this.angleXX = init_pos.angleXX;
    this.angleYY = init_pos.angleYY;
    this.angleZZ = init_pos.angleZZ;

    this.background = !!background;

    if (this.background) {
        this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
        this.cubeVertexPositionBuffer = gl.createBuffer();

        this.textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];

        this.textureVertexIndices = [
            0, 1, 2, 0, 2, 3
        ];

        this.cubeVertexIndexBuffer = this.gl.createBuffer();
    }else{
        this.triangleVertexPositionBuffer = this.gl.createBuffer();
        this.triangleVertexColorBuffer = this.gl.createBuffer();
        this.draw(sx, sy, sz);
    }
}

Piece.prototype.resetValues = function () {
    this.tx = this.init_pos.tx;
    this.ty = this.init_pos.ty;
    this.tz = this.init_pos.tz;

    this.angleXX = this.init_pos.angleXX;
    this.angleYY = this.init_pos.angleYY;
    this.angleZZ = this.init_pos.angleZZ;
    this.globalAngleXX = 0.0;
    this.globalAngleYY = 0.0;
};

Piece.prototype.computeIllumination = function( mvMatrix ) {
    // Phong Illumination Model
    // Ambient coef.
    var kAmbi = [ 0.2, 0.2, 0.2 ];

    // Difuse coef.
    var kDiff = [ 0.7, 0.7, 0.7 ];

    // Specular coef.
    var kSpec = [ 0.7, 0.7, 0.7 ];

    // Phong coef.
    var nPhong = 100;

    // Clearing the colors array

    for( var i = 0; i < this.colors.length; i++ ) {
        this.colors[i] = 0.0;
    }

    // SMOOTH-SHADING

    // Compute the illumination for every vertex

    // Iterate through the vertices

    for( var vertIndex = 0; vertIndex < this.vertices.length; vertIndex += 3 ) {
        // For every vertex
        // GET COORDINATES AND NORMAL VECTOR
        var auxP = this.vertices.slice( vertIndex, vertIndex + 3 );

        var auxN = this.normals.slice( vertIndex, vertIndex + 3 );

        // CONVERT TO HOMOGENEOUS COORDINATES

        auxP.push( 1.0 );

        auxN.push( 0.0 );

        // APPLY CURRENT TRANSFORMATION

        var pointP = multiplyPointByMatrix( mvMatrix, auxP );

        var vectorN = multiplyVectorByMatrix( mvMatrix, auxN );

        normalize( vectorN );

        // VIEWER POSITION

        var vectorV = vec3();

        // Perspective
        // Viewer at ( 0, 0 , 0 )
        vectorV = symmetric( pointP );

        normalize( vectorV );

        // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR

        // FOR EACH LIGHT SOURCE

        for(var l = 0; l < lightSources.length; l++ ) {
            // INITIALIZE EACH COMPONENT, with the constant terms

            var ambientTerm = vec3();

            var diffuseTerm = vec3();

            var specularTerm = vec3();

            // For the current light source

            var ambient_Illumination = lightSources[l].getAmbIntensity();

            var int_Light_Source = lightSources[l].getIntensity();

            var pos_Light_Source = lightSources[l].getPosition();

            // Animating the light source, if defined

            var lightSourceMatrix = mat4();


            for( i = 0; i < 3; i++ )
            {
                // AMBIENT ILLUMINATION --- Constant for every vertex

                ambientTerm[i] = ambient_Illumination[i] * kAmbi[i];

                diffuseTerm[i] = int_Light_Source[i] * kDiff[i];

                specularTerm[i] = int_Light_Source[i] * kSpec[i];
            }

            // DIFFUSE ILLUMINATION

            var vectorL = vec4();

            if( pos_Light_Source[3] == 0.0 )
            {
                // DIRECTIONAL Light Source

                vectorL = multiplyVectorByMatrix(lightSourceMatrix, pos_Light_Source );
            }
            else
            {
                // POINT Light Source

                // TO DO : apply the global transformation to the light source?

                vectorL = multiplyPointByMatrix(lightSourceMatrix, pos_Light_Source );

                for( i = 0; i < 3; i++ )
                {
                    vectorL[ i ] -= pointP[ i ];
                }
            }

            // Back to Euclidean coordinates

            vectorL = vectorL.slice(0,3);

            normalize( vectorL );

            var cosNL = dotProduct( vectorN, vectorL );

            if( cosNL < 0.0 )
            {
                // No direct illumination !!

                cosNL = 0.0;
            }

            // SEPCULAR ILLUMINATION

            var vectorH = add( vectorL, vectorV );

            normalize( vectorH );

            var cosNH = dotProduct( vectorN, vectorH );

            // No direct illumination or viewer not in the right direction

            if( (cosNH < 0.0) || (cosNL <= 0.0) )
            {
                cosNH = 0.0;
            }

            // Compute the color values and store in the colors array

            var tempR = ambientTerm[0] + diffuseTerm[0] * cosNL + specularTerm[0] * Math.pow(cosNH, nPhong);

            var tempG = ambientTerm[1] + diffuseTerm[1] * cosNL + specularTerm[1] * Math.pow(cosNH, nPhong);

            var tempB = ambientTerm[2] + diffuseTerm[2] * cosNL + specularTerm[2] * Math.pow(cosNH, nPhong);

            this.colors[vertIndex] += tempR;

            // Avoid exceeding 1.0

            if( this.colors[vertIndex] > 1.0 ) {
                this.colors[vertIndex] = 1.0;
            }

            // Avoid exceeding 1.0

            this.colors[vertIndex + 1] += tempG;

            if( this.colors[vertIndex + 1] > 1.0 ) {
                this.colors[vertIndex + 1] = 1.0;
            }

            this.colors[vertIndex + 2] += tempB;

            // Avoid exceeding 1.0

            if( this.colors[vertIndex + 2] > 1.0 ) {
                this.colors[vertIndex + 2] = 1.0;
            }
        }
    }
};

// Handling the Vertex and the Color Buffers
Piece.prototype.initBuffers = function () {
    if (this.background) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = this.vertices.length / 3;

        // Textures
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.STATIC_DRAW);
        this.cubeVertexTextureCoordBuffer.itemSize = 2;
        this.cubeVertexTextureCoordBuffer.numItems = 4;

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.textureVertexIndices),
            this.gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = 6;
    }else{
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
    }

    // enable depth test
    this.gl.enable(this.gl.DEPTH_TEST);
};

//  Drawing the model
Piece.prototype.drawPiece = function (angleXX, angleYY, angleZZ, sx, sy, sz, tx, ty, tz, mvMatrix) {
    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));
    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));
    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // NEW - Aux. Function for computing the illumination
    if(this.done){
        this.computeIllumination( mvMatrix );
    }

    if (this.background) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

        // The vertex indices

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    }else{
        // Passing the Model View Matrix to apply the current transformation
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
            this.triangleVertexPositionBuffer.itemSize,
            this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);

        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
            this.triangleVertexColorBuffer.itemSize,
            this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
    }
};

Piece.prototype.draw = function (sx, sy, sz, globalTz) {
    this.shaderProgram = initShaders(this.gl, this.background);
    this.initBuffers();

    //  Drawing the 3D scene
    var pMatrix;
    var mvMatrix = mat4();

    // A standard view volume.
    // Viewer is at (0,0,0)
    // Ensure that the model is "inside" the view volume
    pMatrix = perspective(45, 1, 0.05, 15);

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

    // Instantianting the current model
    this.drawPiece(this.angleXX, this.angleYY, this.angleZZ,
        sx, sy, sz,
        this.tx, this.ty, this.tz,
        mvMatrix);
};

Piece.prototype.initTexture = function (tmpArray, sx, sy, sz, globalTz) {
    var self = this;

    function handleTextureLoaded(texture) {
        self.gl.bindTexture(self.gl.TEXTURE_2D, texture);
        self.gl.pixelStorei(self.gl.UNPACK_FLIP_Y_WEBGL, true);
        self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, texture.image);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.NEAREST);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST);
        self.gl.bindTexture(self.gl.TEXTURE_2D, null);
    }

    texture = this.gl.createTexture();
    texture.image = new Image();

    texture.image.onload = function () {
        handleTextureLoaded(texture);
        self.draw(sx, sy, sz, globalTz);

        for (var model in tmpArray) {
            tmpArray[model].draw(sx, sy, sz, globalTz);
        }
    };

    texture.image.src = "img/background.jpg";
};
