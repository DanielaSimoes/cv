// © RRTeam

function Pieceabstract(url, alias, humanName, initialPosition, finalPosition){
	this.url = url;
	this.alias = alias;
	this.initialPosition = initialPosition;
	this.humanName = humanName;
	this.finalPosition = finalPosition;
}

function Position(tx, ty, tz, angleXX, angleYY, angleZZ){
	this.tx = tx;
	this.ty = ty;
	this.tz = tz;
	this.angleXX = angleXX;
	this.angleYY = angleYY;
	this.angleZZ = angleZZ;
}

function Puzzle(image, humanName){
	this.humanName = humanName;
	this.image = image;
	this.pieces = [];
}


Puzzle.prototype.addPiece = function(piece){
	this.pieces.push(piece);
};
