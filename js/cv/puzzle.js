function Puzzle(info){
	this.title = info.title;
	this.puzzle_pieces = info.puzzle_pieces;

    // WebGL context
	this.gl = null;

    // pieces array
	this.pieces = {};

	// background
	this.background = null;

	// canvas
	this.canvas = document.getElementById("webgl-id");

    // reset puzzle values
	this.resetPuzzle();

    // init webgl
	this.initWebGL();

    // create pieces
	for(var i=0; i<this.puzzle_pieces.length; i++){
	    var result = parseTXTfile(this.puzzle_pieces[i].piece_url);
        this.pieces[this.puzzle_pieces[i].id] = new Piece(this.gl, this.puzzle_pieces[i].init, i,
            result["vertices"].slice(), result["colors"].slice(), false, this.sx, this.sy, this.sz, this.globalTz);
	}
	
	// init background
	this.tmp = [];

	this.initBackground();
    
	for(var piece in this.pieces){
		this.tmp.push(this.pieces[piece]);
	}

	this.background.initTexture(this.tmp);
}

Puzzle.prototype.resetPuzzle = function(){
    // The GLOBAL transformation parameters
    this.globalAngleYY = 0.0;
    this.globalTz = -2.5;

    // The scaling factors
    this.sx = 0.5;
    this.sy = 0.5;
    this.sz = 0.5;

	for(var piece in this.pieces){
		this.pieces[piece].resetValues();
	}
};

Puzzle.prototype.draw = function(){
	// Clearing the frame-buffer and the depth-buffer
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	for(var piece in this.pieces){
		this.pieces[piece].draw(this.sx, this.sy, this.sz, this.globalTz);

	}

	this.background.draw(this.sx, this.sy, this.sz, this.globalTz);
    verify_puzzle();
};

Puzzle.prototype.initBackground = function(){
	var result = parseTXTfile("pieces/background.txt");

    var init_pos = {
        "tx": 0,
        "ty": 0,
        "tz": 0,
        "angleXX": 0,
        "angleYY": 0,
        "angleZZ": 0
    };

	this.background = new Piece(this.gl, init_pos, 0, result["vertices"].slice(), [], true, this.sx, this.sy, this.sz, this.globalTz);
};

// WebGL Initialization
Puzzle.prototype.initWebGL =  function(){
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
	    console.log(e);
	}

	if (!this.gl){
		alert("Could not initialise WebGL, sorry! :-(");
	}
};
