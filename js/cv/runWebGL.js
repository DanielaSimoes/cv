var webgl = null;
var puzzle_id = null;

function runWebGL() {
    puzzle_id = $.urlParam('name');

    if(puzzle_id===null){
        puzzle_id = "1";
    }

    $.ajax({
        dataType: "json",
        url: "/puzzles/puzzle" + puzzle_id + ".json",
        success: function (data) {
            puzzle_definition = data;
            selected_obj_id = puzzle_definition["puzzle_pieces"][0]["id"];
            webgl = new Puzzle(puzzle_definition);

            $(document).ready(function () {
                setEventListeners();
                verify_puzzle();
            });
        }
    });
}
