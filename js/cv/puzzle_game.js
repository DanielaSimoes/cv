var webgl = null;
var selectedPuzzle = 0;

function runWebGL() {
    webgl = new PuzzleLevel(puzzle_definition[selectedPuzzle]);
}
