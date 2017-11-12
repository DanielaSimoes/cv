function PuzzleLevel(level){
    this.title = level.title;
    this.puzzle_pieces = level.puzzle_pieces;

    // WebGL context
    this.gl = null;

    // pieces array
    this.pieces = {};

    // backgroud image
    this.background = null;

    // canvas
    this.canvas = document.getElementById("webgl-id");

    // reset puzzle values
    this.resetPuzzle();

    // init webgl
    this.initWebGL();

    // create pieces
    for(var i=0; i<this.puzzle_pieces.length; i++){
        var piece = this.puzzle_pieces[i];
        var result = parseTXTfile(piece.coordinates);

        this.pieces[piece.title] = new Pieceabstract(this.gl, piece.init,
            result["vertices"].slice(),
            result["colors"].slice(),
            this.sx, this.sy, this.sz, this.globalTz);
    }

    this.drawLevel();
}

PuzzleLevel.prototype.resetPuzzle = function () {
    this.resetLevelValues();

    for(var piece in this.pieces){
        this.pieces[piece].resetValues();
    }
};


PuzzleLevel.prototype.resetLevelValues = function() {
    // The GLOBAL transformation parameters
    this.globalAngleYY = 0.0;
    this.globalTz = 0.0;

    // The scaling factors
    this.sx = 0.5;
    this.sy = 0.5;
    this.sz = 0.5;
};

PuzzleLevel.prototype.drawLevel = function(){
    // Clearing the frame-buffer and the depth-buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    for(var piece in this.pieces){
        this.pieces[piece].drawScene(this.sx, this.sy, this.sz, this.globalTz);
    }
};

// WebGL Initialization
PuzzleLevel.prototype.initWebGL =  function(){
    try{
        // Create the WebGL context
        // Some browsers still need "experimental-webgl"
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

        // DEFAULT: Face culling is DISABLED
        // Enable FACE CULLING
        this.gl.enable(this.gl.CULL_FACE);

        // DEFAULT: The BACK FACE is culled!!
        // The next instruction is not needed...
        this.gl.cullFace(this.gl.BACK);
    } catch (e){
        print("error init webgl");
    }

    if (!this.gl){
        alert("Could not initialise WebGL, sorry! :-(");
    }
};