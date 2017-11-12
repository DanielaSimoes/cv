// © RRTeam

var webgl = null;

var puzzles_json = null;

$.ajax({
  url: 'puzzles.json',
  type: 'get',
  dataType: 'json',
  async: false,
  success: function(data) {
      puzzles_json = data;
  }
});

var puzzles = [];

for(var i=0; i<puzzles_json.puzzles.length; i++){
	puzzles[i] = new Puzzle(puzzles_json.puzzles[i].image, puzzles_json.puzzles[i].humanName);
	for(var j=0; j<puzzles_json.puzzles[i].pieces.length; j++){
		var initP_tmp = puzzles_json.puzzles[i].pieces[j].initialPosition;
		var initP = new Position(initP_tmp.tx, initP_tmp.ty, initP_tmp.tz,
								 						 initP_tmp.angleXX, initP_tmp.angleYY, initP_tmp.angleZZ);

	  var finalP_tmp = puzzles_json.puzzles[i].pieces[j].finalPosition;
		var finalP = new Position(finalP_tmp.tx, finalP_tmp.ty, finalP_tmp.tz,
								 						  finalP_tmp.angleXX, finalP_tmp.angleYY, finalP_tmp.angleZZ);

		var piece = puzzles_json.puzzles[i].pieces[j];

		puzzles[i].addPiece(new Pieceabstract(piece.url,
																  piece.alias,
															 	  piece.humanName,
															 	  initP,
			 												 	  finalP));
	}

	$("#menuLevels").append('<li><a href="#'+puzzles[i].humanName+'" data-toggle="nextLevel">'+puzzles[i].humanName+'</a></li>');
}

var selectedPuzzle = 0;

function runWebGL(){
	webgl = new CanvasWebGl(puzzles[selectedPuzzle]);
}
