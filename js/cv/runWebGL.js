var webgl = null;

function runWebGL() {
    var name = $.urlParam('name');

    if(name===null){
        name = "puzzle1.json";
    }

    $.ajax({
        dataType: "json",
        url: "/puzzles/" + name,
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
