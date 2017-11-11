var puzzle;

$(document).ready(function () {
    var currentLevel = 0;
    puzzle = new PuzzleLevel(puzzle_definition[currentLevel]);
});
