var webgl = null;

function runWebGL() {
    webgl = new Puzzle(puzzle_definition);

    $(document).ready(function () {
        setEventListeners();
        verify_puzzle();
    });
}
